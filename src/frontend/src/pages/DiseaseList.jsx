import React, { useState, useEffect } from "react";
import Select from 'react-select';
import {
    Card,
    Grid,
    Typography,
    Slider
} from "@mui/material";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardBody,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
  } from 'mdb-react-ui-kit';
import axios from 'axios';
import SearchBar from '../components/SearchBar'
import Stylesheet from "reactjs-stylesheet";
import { BACKEND_URL } from "../config";

const styles = Stylesheet.create({
    bodyContainer: () => ({
      padding: "30px 30px 10px 30px",
      backgroundColor: "#ffeedd",
    }),
    cardContainer: () => ({
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        height: 500, // Set a fixed height
        overflow: "auto", // Enable scroll when content exceeds height
        display: "flex",
        flexDirection: "column",
        justifyContent: "Left",
      }),
      

    faqsBox: () => ({
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
    }),

    sliders: () => ({
        paddingTop: '150px',
    }),

    areaDropdown: () => ({
        paddingTop: '50px',
    }),
    
});

const DiseaseList = () => {
    const [diseases, setDiseases] = useState([]);
    const [areas, setAreas] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);


    const [sCount, setSCount] = useState([0, 20]);
    const [tCount, setTCount] = useState([0, 20]);
    const [pCount, setPCount] = useState([0, 1]);
    const [mCount, setMCount] = useState([0, 1]);
    const [trCount, setTrCount] = useState([0, 1]);

    const [sSearch, setSSearch] = useState("");
    const [tSearch, setTSearch] = useState("");

    const handleSCount = (event, newValue) => {
        setSCount(newValue);
    };
    const handleTCount = (event, newValue) => {
        setTCount(newValue);
    };
    const handlePCount = (event, newValue) => {
      setPCount(newValue);
    };
    const handleMCount = (event, newValue) => {
      setMCount(newValue);
    };
    const handleTrCount = (event, newValue) => {
      setTrCount(newValue);
    };


    const handleSymptomSearch = (newValue) => {
        console.log(`Searching for "${newValue}"...`);
        setSSearch(newValue);
      };

      const handleTreatmentSearch = (newValue) => {
        console.log(`Searching for "${newValue}"...`);
        setTSearch(newValue);
      };

      const handleAreaChange = (event) => {
        console.log(areas)
        console.log(event)
        const tmp = event.map(area => (area.value || area))
        console.log(tmp)
        setAreas(event)
        console.log(areas)
      }
      
      const getDiseases = async () => {
        const params = JSON.stringify({minSymptoms: sCount[0], maxSymptoms: sCount[1], searchSymptoms: sSearch,
            minTreatments: tCount[0], maxTreatments: tCount[1], searchTreatments: tSearch,
            specialties: areas.map(area =>(area.value)),
            minPrevalency: pCount[0], maxPrevalency: pCount[1], minTransmission: trCount[0], maxTransmission: trCount[1],
            minMortality: mCount[0], maxMortality: mCount[1]})
            
        const response = await axios.get(BACKEND_URL + '/api/diseases', {params: {params}});
        setDiseases(response.data);
      };
      
      const getAreaOptions = async () =>{
        const response = await axios.get(BACKEND_URL + '/api/specialties');
        setAreaOptions(response.data.map(area => ({'value': area.name, 'label': area.name, 'key': area._key})));
    }

    const createPatient = async (name, age, height, weight) =>{
        try{
            const response = await axios.post(BACKEND_URL + `/api/patient`,{
                name: name,
                age: age,
                height: height,
                weight: weight
            });
            console.log(response.data)
        } catch (error) {
            console.error(error); // Handle any errors
        }
    }

      useEffect(() => {
        getDiseases();
        getAreaOptions();

      }, [sCount, tCount, sSearch, tSearch,mCount,pCount,trCount, areas]);

    return(      
        <MDBContainer className="py-5">
      <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <a href='/'>Home</a>
              </MDBBreadcrumbItem>

              <MDBBreadcrumbItem active>Disease List</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBCard className="mb-4">
              <MDBCardBody>
              <div style={{display: "flex", flex: 1, flexDirection: "row"}}>
                <Grid container columnSpacing={5}>
                    <Grid style={styles.sliders()} item xs={12} md={2}>                      
                        <Slider
                            getAriaLabel={() => 'Number of symptoms'}
                            valueLabelDisplay="auto"
                            value={sCount}
                            max={20}
                            onChange={handleSCount}
                            />
                        <Typography variant="body2" gutterBottom>
                            Number of Symptoms from {sCount[0]} to {sCount[1]}
                        </Typography>
                        <SearchBar onSearch={handleSymptomSearch}/>

                        {/* Second slider */}

                        <Slider
                            getAriaLabel={() => 'Number of treatments'}
                            valueLabelDisplay="auto"
                            value={tCount}
                            max={20}
                            onChange={handleTCount}
                            />
                        <Typography variant="body2" gutterBottom>
                            Number of Treatments from {tCount[0]} to {tCount[1]}
                        </Typography>
                        <SearchBar onSearch={handleTreatmentSearch}/>

                        {/* Area Dropdown */}
                        <div style={styles.areaDropdown()}>
                            <Select
                                value={areas}
                                
                                onChange={handleAreaChange}
                                isMulti
                                name="areas"
                                options={areaOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        
                        </div>
                        <Slider
                            getAriaLabel={() => 'Prevalency'}
                            valueLabelDisplay="auto"
                            value={pCount}
                            max={1}
                            min={0}
                            step={0.01}
                            onChange={handlePCount}
                            />
                        <Typography variant="body2" gutterBottom>
                            Prevalency from {pCount[0]} to {pCount[1]}
                        </Typography>

                        <Slider
                            getAriaLabel={() => 'Mortality'}
                            valueLabelDisplay="auto"
                            value={mCount}
                            max={1}
                            min={0}
                            step={0.01}

                            onChange={handleMCount}
                            />
                        <Typography variant="body2" gutterBottom>
                            Mortality from {mCount[0]} to {mCount[1]}
                        </Typography>

                        <Slider
                            getAriaLabel={() => 'Transmission'}
                            valueLabelDisplay="auto"
                            value={trCount}
                            max={1}
                            min={0}
                            step={0.01}

                            onChange={handleTrCount}
                            />
                        <Typography variant="body2" gutterBottom>
                            Transmission from {trCount[0]} to {trCount[1]}
                        </Typography>


                    </Grid>
                    <Grid item xs={12} md={10}>
                        <h1 className='text-3xl lg:text-4xl font-extrabold inline-block select-none mt-10 flex justify-center items-center'>Search Results</h1>
                        <Card style={styles.cardContainer()}>
                        <div className='flex-col p-0 sm:m-auto'>
                            <div className='search-results'>
                              <ol className="list-group list-group-numbered">
                                {diseases.map((result) => (
                                  <a href={'/disease/' + result._key}>
                                    <div key={result._id} className="clickable-div">
                                      <li className="list-group-item">
                                        <div className="ms-2 me-auto">
                                          <div className="fw-bold">Name: {result.name}</div>
                                          <div>Prevalency: {(result.prevalency * 100).toFixed(2)}%</div>
                                          <div>Mortality:  {(result.mortality * 100).toFixed(2)}%</div>
                                          <div>Transmission:  {(result.transmission * 100).toFixed(2)}%</div>
                                        </div>
                                      </li>
                                    </div>
                                  </a>
                                ))}
                                </ol>
                            </div>
                        </div>
                        </Card>
                        
                    </Grid>
                </Grid>
            </div>
                
              </MDBCardBody>
        </MDBCard>
        <MDBCard className="mb-4">
            
        </MDBCard>

      </MDBContainer>
    )
}

export default DiseaseList;