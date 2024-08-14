const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');

const arangojs = require("arangojs");
const fs = require("fs");
const db = new arangojs.Database({ url: "http://localhost:8529" });

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.get('/api/diseases', async (req, res) => {
    try {
        const params = JSON.parse(req.query.params);
        const query = arangojs.aql`
        FOR disease IN diseases
            FILTER disease.mortality > ${params.minMortality}
            FILTER disease.mortality < ${params.maxMortality}
            FILTER disease.prevalency > ${params.minPrevalency}
            FILTER disease.prevalency < ${params.maxPrevalency}
            FILTER disease.transmission > ${params.minTransmission}
            FILTER disease.transmission < ${params.maxTransmission}
            FILTER LENGTH(
                FOR symptom IN OUTBOUND disease HasSymptom                  
                    RETURN symptom
            ) >= ${params.minSymptoms}
            FILTER LENGTH(
                FOR symptom IN OUTBOUND disease HasSymptom
                    RETURN symptom
            ) <= ${params.maxSymptoms}
            FILTER LENGTH(
                FOR symptom IN OUTBOUND disease HasSymptom
                    FILTER symptom LIKE CONCAT("%", ${params.searchSymptoms}, "%") 
                    RETURN symptom
            ) > 0 || ${params.searchSymptoms} == ""
            FILTER LENGTH(
                FOR treatment IN OUTBOUND disease HasTreatment
                    RETURN treatment
            ) >= ${params.minTreatments}
            FILTER LENGTH(
                FOR treatment IN OUTBOUND disease HasTreatment
                    RETURN treatment
            ) <= ${params.maxTreatments}
            FILTER LENGTH(
                FOR treatment IN OUTBOUND disease HasTreatment
                    FILTER treatment LIKE CONCAT("%", ${params.searchTreatments}, "%") 
                    RETURN treatment
            ) > 0 || ${params.searchTreatments} == ""
            FILTER LENGTH(
                FOR specialty IN OUTBOUND disease BelongsToArea
                    FILTER specialty.name IN ${params.specialties}
                    RETURN specialty
            ) > 0 || LENGTH(${params.specialties}) == 0
            RETURN disease
        `;
            
        const cursor = await db.query(query);     
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Diseases request error');
  }
});

app.get('/api/diseases/symptom/:key', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR symptom IN symptoms
            FILTER symptom._key == ${req.params.key}

            FOR disease IN INBOUND symptom HasSymptom
                RETURN disease
         `;
            
        const cursor = await db.query(query);     
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Diseases request error');
  }
});
app.get('/api/diseases/treatment/:key', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR treatment IN treatments
            FILTER treatment._key == ${req.params.key}

            FOR disease IN INBOUND treatment HasTreatment
                RETURN disease
         `;
            
        const cursor = await db.query(query);     
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Diseases request error');
  }
});

app.get('/api/treatments/:diseaseKey', async (req, res) => {
    try{
        const diseaseKey = "diseases/" + req.params.diseaseKey
        const query = arangojs.aql`
            FOR treatment IN OUTBOUND ${diseaseKey} HasTreatment
            RETURN treatment
        `
        const cursor = await db.query(query);
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Treatments request error');
  }
});

app.get('/api/disease/:key', async (req, res) => {
    try{
        const query = arangojs.aql`
            LET disease = DOCUMENT('diseases', ${req.params.key})
            LET specialty = FIRST(
              FOR area IN 1..1 OUTBOUND disease BelongsToArea
                RETURN area
            )
            RETURN { name: disease.name, mortality: disease.mortality, prevalency: disease.prevalency, transmission: disease.transmission, area: specialty.name }            

        `
        const cursor = await db.query(query);
        const result = await cursor.next();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Treatments request error');
  }
});

app.get('/api/symptoms/:diseaseKey', async (req, res) => {
    try{
        const diseaseKey = "diseases/" + req.params.diseaseKey
        const query = arangojs.aql`
            FOR symptom IN OUTBOUND ${diseaseKey} HasSymptom
            RETURN symptom
        `

        console.log(query)
        const cursor = await db.query(query);
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Symptoms request error');
  }
});

app.get('/api/specialties', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR area IN areas
            RETURN area
        `;

        const cursor = await db.query(query);
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Diseases request error');
  }
});

app.get('/api/hospitals', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR hospital IN hospitals
            RETURN hospital
        `;

        const cursor = await db.query(query);
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Hospitals request error');
  }
});


app.post('/api/patient/', async (req, res) => {
    try{
        const data = req.body        
        const query = arangojs.aql`
        // Insert patient document into patients collection
        INSERT {
        "name": ${data.name},
        "age": ${data.age},
        "weight": ${data.weight},
        "height": ${data.height}
        }
        INTO patients
        `;
        
        const cursor = await db.query(query);

        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: 'Patient created successfully' });
        
    }
    catch(error){
        console.error(error);
        res.status(500).send('Add Patient request error');
    }
});

app.post('/api/patient/:key', async (req, res) => {
    try{
        const data = req.body        
        const query = arangojs.aql`

        // Create or update the HasPatient edge
        FOR hospital IN hospitals
        FILTER hospital._key == ${req.params.key}
        LET patient = (
            INSERT {
            "name": ${data.name},
            "age": ${data.age},
            "weight": ${data.weight},
            "height": ${data.height}
            }
            IN patients
            RETURN NEW
        )[0]
        UPSERT { "_from": hospital._id, "_to": patient._id }
        INSERT {
            "_from": hospital._id,
            "_to": patient._id
        }
        UPDATE { }
        IN HasPatient
        OPTIONS { ignoreErrors: true }

        `;
        
        const cursor = await db.query(query);

        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: 'Patient created successfully' });
        
    }
    catch(error){
        console.error(error);
        res.status(500).send('Add Patient request error');
    }
});


app.put('/api/hospital/:key', async (req, res) => {
    const key = req.params.key
    const data = req.body        
    const query = arangojs.aql`
        UPDATE { _key:  ${key} } WITH {
            "name": ${data.name},
            "size": ${data.size},
            "workForce": ${data.workForce},
            "bedNumber": ${data.bedNumber},
        }
         IN hospitals
        `;

    const cursor = await db.query(query);

    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({ message: `Hospital with ID ${key} edited successfully` });

});

app.get('/api/hospital/:key', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR hospital IN hospitals
            FILTER hospital._key == ${req.params.key}
            RETURN hospital
        `;

        const cursor = await db.query(query);
        const result = await cursor.next();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Hospital request error');
  }
});

app.get('/api/symptom/:key', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR symptom IN symptoms
            FILTER symptom._key == ${req.params.key}
            RETURN symptom
        `;

        const cursor = await db.query(query);
        const result = await cursor.next();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Hospital request error');
  }
});
app.get('/api/treatment/:key', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR treatment IN treatments
            FILTER treatment._key == ${req.params.key}
            RETURN treatment
        `;

        const cursor = await db.query(query);
        const result = await cursor.next();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Hospital request error');
  }
});

app.get('/api/hospital/:key/statistics', async (req, res) => {
    try {
        const query = arangojs.aql`
        FOR hospital IN hospitals
            FILTER hospital._key == ${req.params.key}
            LET avgMortality = (
                FOR patient IN OUTBOUND hospital HasPatient
                    FOR disease IN OUTBOUND patient HasDisease
                        RETURN disease.mortality
            )
            
        FOR hospital2 IN hospitals
        FILTER hospital2._key == ${req.params.key}
        LET treatmentCount = (
            FOR patient2 IN OUTBOUND hospital2 HasPatient
                FOR disease2 IN OUTBOUND patient2 HasDisease
                    FOR treatment IN OUTBOUND disease2 HasTreatment
                    RETURN treatment
        )
    
        LET uniqueTreatments = UNIQUE(treatmentCount)
        FOR hospital3 IN hospitals
        FILTER hospital3._key == ${req.params.key}
        LET symptomCount = (
            FOR patient3 IN OUTBOUND hospital3 HasPatient
                FOR disease3 IN OUTBOUND patient3 HasDisease
                        FOR symptom IN OUTBOUND disease3 HasSymptom
                            RETURN symptom
        )
        LET maxSymptoms = (
            FOR count IN symptomCount
                COLLECT dummy = 1 AGGREGATE maxCount = MAX(count)
                RETURN maxCount
        )
        LET minSymptoms = (
            FOR count IN symptomCount
                COLLECT dummy = 1 AGGREGATE minCount = MIN(count)
                RETURN minCount
        )

    
        RETURN {
            treatmentCount2: LENGTH(uniqueTreatments),
            averageMortality: AVERAGE(avgMortality),
            maxSymptomsName: maxSymptoms[0].name,
            minSymptomsName: minSymptoms[0].name
        }

        `;


        const cursor = await db.query(query);
        const result = await cursor.next();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Hospital request error');
  }
});

app.get('/api/patients/:key', async (req, res) => {
    try {
        const hospitalKey = "hospitals/" + req.params.key
        const query = arangojs.aql`
        FOR patient IN OUTBOUND ${hospitalKey} HasPatient
            RETURN patient
        `;
        
        console.log(query)
        const cursor = await db.query(query);
        const result = await cursor.all();

        res.header('Access-Control-Allow-Origin', '*');
        res.json(result)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Hospital request error');
  }
});


app.delete('/api/patient/:key', async (req, res) => {
    const key = req.params.key
    const query = arangojs.aql`
        LET node = DOCUMENT('patients', ${key})
        FOR hEdge IN HasPatient
            FILTER hEdge._to == node._id
            REMOVE hEdge IN HasPatient
        FOR dEdge IN HasDisease
            FILTER dEdge._from == node._id
            REMOVE dEdge IN HasDisease
        FOR sEdge IN HasSymptom
            FILTER sEdge._from == node._id
            REMOVE sEdge IN HasSymptom
        REMOVE {_key: ${key}} IN patients
        `;
        
    const cursor = await db.query(query);

    res.status(200).json({ message: `Patient with ID ${key} deleted successfully` });
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});