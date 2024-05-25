const arangojs = require("arangojs");
const fs = require("fs");
const db = new arangojs.Database({ url: "http://localhost:8529" });


async function findDisease(disease) {
  const query = arangojs.aql`
    FOR disease IN diseases
    FILTER disease.name == ${disease}
    RETURN disease
  `;
  // console.log(query);
  const cursor = await db.query(query);

  let counter = 0;
  for await (const items of cursor) {
    counter++;
    // console.log(items);
  }
  // console.log("counter = " + counter);


  const result = await cursor.next();
  return result;
}

// Find a symptom document with a given name
async function findSymptom(symptom) {
  const query = arangojs.aql`
    FOR symptom IN symptoms
    FILTER symptom.name == ${symptom}
    LIMIT 1
    RETURN symptom
  `;
  const cursor = await db.query(query);

  let counter = 0;
  for await (const items of cursor) {
    counter++;
    // console.log(items);
  }
  // console.log("counter = " + counter);

  const result = await cursor.next();
  return result;
}

async function main () {

// Set the database name and login credentials
db.database("BDNR");
db.useBasicAuth("root", "test123");

await db.collection("diseases").drop();
await db.collection("symptoms").drop();
await db.collection("disease-symptom").drop();

// Define the collections
const diseases = db.createCollection("diseases");
const symptoms = db.createCollection("symptoms");
const disease_symptom = db.createEdgeCollection("disease-symptom");


// Insert the list of diseases into the diseases collection
try {
  const data = fs.readFileSync("./data/diseases.json");
  const diseaseList = JSON.parse(data);
  const diseaseDocs = diseaseList.map(disease => ({name: disease.diseaseLabel}));
  (await diseases).import(diseaseDocs);
} catch (err) {
  console.error("Error at importing diseases");
  console.error(err);
}

// Insert the list of symptoms into the symptoms collection
try {
  const data = fs.readFileSync("./data/symptoms.json");
  const symptomList = JSON.parse(data);
  const symptomDocs = symptomList.map(symptom => ({ name: symptom.symptomLabel}));
  (await symptoms).import(symptomDocs);
} catch (err) {
  console.error("Error at importing symptoms");
  console.error(err);
}

// Insert the list of health areas into the heealth areas collection
try {
  const data = fs.readFileSync("./data/areas.json");
  const areaList = JSON.parse(data);
  const areaDocs = areaList.map(area => ({ name: area.areaLabel}));
  (await area).import(areaDocs);
} catch (err) {
  console.error("Error at importing symptoms");
  console.error(err);
}




try {
  const data = fs.readFileSync("./data/disease_symptom.json");
  const disease_symptomList = JSON.parse(data);
  
  let counter = 0;
  for (const { diseaseLabel, symptomLabel } of disease_symptomList) {
    
    const diseaseDoc = await findDisease(diseaseLabel);
    // console.log("diseaseDoc = ");
    // console.log(diseaseDoc);
    const symptomDoc = await findSymptom(symptomLabel);
    // console.log("symptomDoc = ");
    // console.log(symptomDoc);

    if (diseaseDoc != undefined && symptomDoc != undefined) {
      counter++;
      await disease_symptom.saveEdge({ _from: diseaseDoc.name, _to: symptomDoc.name });
    }
  }
  console.log("counter = " + counter);
} catch (err) {
  console.error("IMPORT DISEASE_SYMPTOMS DEU ERRADO");
  console.error(err);
}

  console.log("DEU CERTO FAMILIA")
  return;
}

main().then(() => console.log("Success"))