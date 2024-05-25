const arangojs = require("arangojs");
const fs = require("fs");
const db = new arangojs.Database({ url: "http://localhost:8529" });

function generatePrevalency(){
    const random = Math.random();

    const bias = 0.9;
  
    // Use a power law function to bias the random number
    const exponent = Math.log(random) / Math.log(bias);
    const prevalencyRatio = exponent / 200;
  
    return prevalencyRatio;
  }


function generateMortality(){
  const random = Math.random();

  const bias = 0.9;

  // Use a power law function to bias the random number
  const exponent = Math.log(random) / Math.log(bias);
  const mortalityRatio = exponent / 200;

  return mortalityRatio;
}

function generateTransmission(){
  const random = Math.random();

  const bias = 0.5;

  // Use a power law function to bias the random number
  const exponent = Math.log(random) / Math.log(bias);
  const mortalityRatio = exponent / 20;

  return mortalityRatio;
}

function generateDuration(){
  const random = Math.random();
  const bias = 0.9;

  // Calculate the exponent based on the bias and the range [2, 32]
  const exponent = Math.log(random) / Math.log(bias);
  const duration = Math.round(Math.pow(bias, exponent) * 30) + 2;

  // Return the duration in days
  return duration;
}

function generateSeverity(){
  const random = Math.random();

  // Bias the distribution towards early values
  const bias = 0.1;

  // Calculate the exponent based on the bias and the range [1, 5]
  const exponent = Math.log(random) / Math.log(bias);
  const severity = Math.round(Math.pow(bias, exponent) * 4) + 1;

  // Return the value
  return severity;
}

function generateAge(){
  const random = Math.random();

  // Bias the distribution towards age 80
  const bias = 0.2;

  // Set the range of ages to generate
  const minAge = 18;
  const maxAge = 100;

  // Calculate the exponent based on the bias and the age range
  const exponent = Math.log(random) / Math.log(bias);
  const age = Math.round(Math.pow(bias, exponent) * (maxAge - minAge)) + minAge;

  // Return the age
  return age;
}

function generateHeight(){
   // Generate a random number between 0 and 1
   const random = Math.random();

   // Bias the distribution towards height 180 cm
   const bias = 0.2;
 
   // Set the range of heights to generate
   const minHeight = 130;
   const maxHeight = 210;
 
   // Calculate the exponent based on the bias and the height range
   const exponent = Math.log(random) / Math.log(bias);
   const value = Math.round(Math.pow(bias, exponent) * (maxHeight - minHeight)) + minHeight;
 
   // Return the height
   return value;
}

function generateWeight(){
  const random = Math.random();

  // Bias the distribution towards weight 80 kg
  const bias = 0.2;

  // Set the range of weights to generate
  const minWeight = 40;
  const maxWeight = 110;

  // Calculate the exponent based on the bias and the weight range
  const exponent = Math.log(random) / Math.log(bias);
  const value = Math.round(Math.pow(bias, exponent) * (maxWeight - minWeight)) + minWeight;

  // Return the weight
  return value;
}

function generateSize(){
  // Generate a random number between 0 and 1
  const random = Math.random();

  // Bias the distribution towards area 1000 square meters
  const bias = 0.2;

  // Set the range of areas to generate
  const minArea = 500;
  const maxArea = 10000;

  // Calculate the exponent based on the bias and the area range
  const exponent = Math.log(random) / Math.log(bias);
  const size = Math.round(Math.pow(bias, exponent) * (maxArea - minArea)) + minArea;

  // Return the area
  return size;
}

function generateWorkForce(){
  const minWorkforce = 50;
  const maxWorkforce = 500;

  // Generate a random integer between minWorkforce and maxWorkforce (inclusive)
  const value = Math.floor(Math.random() * (maxWorkforce - minWorkforce + 1)) + minWorkforce;

  // Return the workforce
  return value;

}

function generateBedNumber(){
  const minBeds = 50;
  const maxBeds = 500;

  // Generate a random integer between minBeds and maxBeds (inclusive)
  const value = Math.floor(Math.random() * (maxBeds - minBeds + 1)) + minBeds;

  // Return the bed number
  return value;
}

async function findDisease(disease) {
  const query = arangojs.aql`
    FOR disease IN diseases
    FILTER disease.name == ${disease}
    LIMIT 1
    RETURN disease
  `;
  const cursor = await db.query(query);

  const result = await cursor.next();
  return result;
}

// Find a symptom document with a given name
async function findSymptom(symptom) {
  const query = arangojs.aql`
    FOR symptom IN symptoms
    FILTER symptom.name == ${symptom}
    RETURN symptom
  `;
  const cursor = await db.query(query);
  const result = await cursor.next();
  return result;
}


// Find a treatment document with a given name
async function findTreatment(treatment) {
  const query = arangojs.aql`
    FOR treatment IN treatments
    FILTER treatment.name == ${treatment}
    LIMIT 1
    RETURN treatment
  `;
  const cursor = await db.query(query);
  const result = await cursor.next();
  return result;
}


// Find a area document with a given name
async function findArea(area) {
  const query = arangojs.aql`
    FOR area IN areas
    FILTER area.name == ${area}
    LIMIT 1
    RETURN area
  `;
  const cursor = await db.query(query);
  const result = await cursor.next();
  return result;
}


// Find a patient document with a given name
async function findPatient(patient) {
  const query = arangojs.aql`
    FOR patient IN patients
    FILTER patient.name == ${patient}
    LIMIT 1
    RETURN patient
  `;
  const cursor = await db.query(query);
  const result = await cursor.next();
  return result;
}


// Find a hospital document with a given name
async function findHospital(hospital) {
  const query = arangojs.aql`
    FOR hospital IN hospitals
    FILTER hospital.name == ${hospital}
    RETURN hospital
  `;
  const cursor = await db.query(query);
  const result = await cursor.next();
  return result;
}

async function main () {

// Set the database name and login credentials
db.database("BDNR");
db.useBasicAuth("root", "test123");

// await db.collection("diseases").drop();
// await db.collection("symptoms").drop();
// await db.collection("treatments").drop();
// await db.collection("areas").drop();
// await db.collection("patients").drop();
// await db.collection("hospitals").drop();
// await db.collection("BelongsToArea").drop();
// await db.collection("ExperiencesSymptom").drop();
// await db.collection("HasTreatment").drop();
// await db.collection("HasDisease").drop();
// await db.collection("HasSymptom").drop();
// await db.collection("HasPatient").drop();

// Define the collections
const diseases = db.createCollection("diseases");
const symptoms = db.createCollection("symptoms");
const treatments = db.createCollection("treatments");
const areas = db.createCollection("areas");
const patients = db.createCollection("patients");
const hospitals = db.createCollection("hospitals");
const disease_symptom = db.createEdgeCollection("HasSymptom");
const disease_treatment = db.createEdgeCollection("HasTreatment");
const disease_patient= db.createEdgeCollection("HasDisease");
const symptom_patient = db.createEdgeCollection("ExperiencesSymptom");
const hospital_patient = db.createEdgeCollection("HasPatient");
const disease_area = db.createEdgeCollection("BelongsToArea");


// Insert the list of diseases into the diseases collection
try {
  const data = fs.readFileSync("./data/diseases.json");
  const diseaseList = JSON.parse(data);
  const diseaseDocs = diseaseList.map(disease => ({name: disease.diseaseLabel,
  prevalency: generatePrevalency(), mortality: generateMortality(), transmission: generateTransmission()}));
  await (await diseases).import(diseaseDocs);
} catch (err) {
  console.error("Error at importing diseases");
  console.error(err);
}

// Insert the list of symptoms into the symptoms collection
try {
  const data = fs.readFileSync("./data/symptoms.json");
  const symptomList = JSON.parse(data);
  const symptomDocs = symptomList.map(symptom => ({ name: symptom.symptomLabel, severity: generateSeverity()}));
  await (await symptoms).import(symptomDocs);
} catch (err) {
  console.error("Error at importing symptoms");
  console.error(err);
}

// Insert the list of treatments into the treatments collection
try {
  const data = fs.readFileSync("./data/treatments.json");
  const treatmentList = JSON.parse(data);
  const treatmentDocs = treatmentList.map(treatment => ({ name: treatment.treatmentLabel, duration: generateDuration()}));
  await (await treatments).import(treatmentDocs);
} catch (err) {
  console.error("Error at importing treatments");
  console.error(err);
}

// Insert the list of names into the names collection
try {
  const data = fs.readFileSync("./data/names.json");
  const nameList = JSON.parse(data);
  const nameDocs = nameList.map(patient => ({ name: patient.name, age: generateAge(), height:generateHeight(), weight: generateWeight()}));
  await (await patients).import(nameDocs);
} catch (err) {
  console.error("Error at importing names");
  console.error(err);
}

// Insert the list of areas into the areas collection
try {
  const data = fs.readFileSync("./data/areas.json");
  const areaList = JSON.parse(data);
  const areaDocs = areaList.map(area => ({ name: area.areaLabel}));
  await (await areas).import(areaDocs);
} catch (err) {
  console.error("Error at importing areas");
  console.error(err);
}

// Insert the list of hospitals into the hospitals collection
try {
  const data = fs.readFileSync("./data/hospitals.json");
  const hospitalList = JSON.parse(data);
  const hospitalDocs = hospitalList.map(hospital => ({ name: hospital.name, x:hospital.x, y:hospital.y, size: generateSize(), workForce: generateWorkForce(), bedNumber: generateBedNumber()}));
  await (await hospitals).import(hospitalDocs);
} catch (err) {
  console.error("Error at importing hospitals");
  console.error(err);
}


// ---------------------------------edges--------------------------------------
let counter = 0;
try {
  const data = fs.readFileSync("./data/disease_symptom.json");
  const disease_symptomList = JSON.parse(data);
  
  
  for (const { diseaseLabel, symptomLabel } of disease_symptomList) {

    const diseaseDoc = await findDisease(diseaseLabel);
    const symptomDoc = await findSymptom(symptomLabel);

    if (diseaseDoc != undefined && symptomDoc != undefined) {
      counter++;
      (await disease_symptom).save({ _from: diseaseDoc._id, _to: symptomDoc._id });
    }
  }
} catch (err) {
  console.error("Edge Disease Symptom Error");
  console.error(err);
}
console.log("Edge Disease Symptom Finished with " + counter + " items")

counter = 0;

try {
  const data = fs.readFileSync("./data/disease_treatment.json");
  const disease_treatmentList = JSON.parse(data);
  
  
  for (const { treatmentLabel, diseaseLabel } of disease_treatmentList) {
    
    const diseaseDoc = await findDisease(diseaseLabel);
    const treatmentDoc = await findTreatment(treatmentLabel);

    if (diseaseDoc != undefined && treatmentDoc != undefined) {
      counter++;
      (await disease_treatment).save({ _from: diseaseDoc._id, _to: treatmentDoc._id });
    }
  }
} catch (err) {
  console.error("Edge Disease Treatment Error");
  console.error(err);
}
console.log("Edge Disease Treatment Finished with " + counter + " items")

counter = 0;
try {
  const data = fs.readFileSync("./data/disease_area.json");
  const disease_areaList = JSON.parse(data);
  
  let counter = 0;
  for (const { diseaseLabel, specialtyLabel } of disease_areaList) {
    
    const diseaseDoc = await findDisease(diseaseLabel);
    const areaDoc = await findArea(specialtyLabel);

    if (diseaseDoc != undefined && areaDoc != undefined) {
      counter++;
      (await disease_area).save({ _from: diseaseDoc._id, _to: areaDoc._id });
    }
  }
  console.log("counter = " + counter);
} catch (err) {
  console.error("Edge Disease Area Error");
  console.error(err);
}
  console.log("Edge Disease Area Finished with " + counter + " items")

counter = 0;
try {
  const data = fs.readFileSync("./data/patient_disease.json");
  const disease_patientList = JSON.parse(data);
  
  let counter = 0;
  for (const { patient, disease } of disease_patientList) {
    
    const diseaseDoc = await findDisease(disease);
    const patientDoc = await findPatient(patient);

    if (diseaseDoc != undefined && patientDoc != undefined) {
      counter++;
      (await disease_patient).save({ _from: patientDoc._id, _to: diseaseDoc._id });
    }
  }
} catch (err) {
  console.error("Edge Disease Patient Error");
  console.error(err);
}
console.log("Edge Disease Patient Finished with " + counter + " items")

counter = 0;
try {
  const data = fs.readFileSync("./data/patient_symptom.json");
  const symptom_patientList = JSON.parse(data);
  
  let counter = 0;
  for (const { patient, symptom } of symptom_patientList) {
    
    const symptomDoc = await findSymptom(symptom);
    const patientDoc = await findPatient(patient);

    if (symptomDoc != undefined && patientDoc != undefined) {
      counter++;
      (await symptom_patient).save({ _from: patientDoc._id, _to: symptomDoc._id });
    }
  }
} catch (err) {
  console.error("Edge Symptom Patient Error");
  console.error(err);
}
console.log("Edge Symptom Patient Finished with " + counter + " items")

counter = 0;
try {
  const data = fs.readFileSync("./data/patient_hospital.json");
  const hospital_patientList = JSON.parse(data);
  
  let counter = 0;
  for (const { patient, hospital } of hospital_patientList) {
    
    const hospitalDoc = await findHospital(hospital);
    const patientDoc = await findPatient(patient);

    if (hospitalDoc != undefined && patientDoc != undefined) {
      counter++;
      (await hospital_patient).save({ _from: hospitalDoc._id, _to: patientDoc._id });
    }
  }
} catch (err) {
  console.error("Edge Hospital Patient Error");
  console.error(err);
}
console.log("Edge Hospital Patient Finished with " + counter + " items")



  return;
}



main().then(() => console.log("Success"))