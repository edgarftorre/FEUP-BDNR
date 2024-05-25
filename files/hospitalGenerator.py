import json
import random

# cities_names = ["Cleveland Heights City Clinic","Cedar Park Community Medical Center","Richmond City Hospital","Layton County Hospital","Manhattan City Hospital","Downers Grove Community Clinic","Coon Rapids Regional Clinic","Inglewood Community Clinic","Newark Regional Medical Center", "Palm Coast City Medical Center"]


# cities = [{"name": city} for _, city in enumerate(cities_names)]

# Convert dictionary to JSON
#hospital_data = json.dumps(cities)

# f = open("hospitals.json", "r")
# hospital_data = json.loads(f.read())
# f.close()



f = open("patient_disease.json", "r", encoding="utf8")
patients_data = json.loads(f.read())
f.close()

f = open("disease_symptom.json", "r", encoding="utf8")
symptoms_data = json.loads(f.read())
f.close()

# create a dictionary to store the name-hospital pairs


patient_list = []

currentDisease = ""
count = 0

# loop through the names and hospitals lists
for patient in patients_data:
    for symptom in symptoms_data:
        if patient['disease'] == symptom['diseaseLabel']:
            if (not(symptom['diseaseLabel'] == currentDisease and random.random() < 0.6)):
                patient_list.append({'patient': patient['patient'], 'symptom': symptom['symptomLabel']})

            if (symptom['diseaseLabel'] != currentDisease):
                currentDisease = symptom['diseaseLabel']

    
print(patient_list)

f = open("patient_symptom.json", "w")
f.write(json.dumps(patient_list))
f.close()