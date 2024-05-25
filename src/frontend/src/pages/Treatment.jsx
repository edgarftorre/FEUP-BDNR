import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import treatmentIcon from '../assets/images/treatment.png'

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,

} from 'mdb-react-ui-kit';


import { BACKEND_URL } from "../config";
import axios from 'axios';


export default function Treatment() {
  const { key } = useParams();

  const [treatment, setTreatment] = useState({name: '', duration: ''}); 


  const [diseases, setDiseases] = useState([])


  useEffect(() => {
    getDiseases();
    getTreatment();
  }, []);

  const getTreatment = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/treatment/' + key)
      console.log(response.data)
      setTreatment(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }
  const getDiseases = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/diseases/treatment/' + key)
      console.log(response.data)
      setDiseases(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <a href='/'>Home</a>
              </MDBBreadcrumbItem>

              <MDBBreadcrumbItem active>Treatment Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={treatmentIcon}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted mb-1"><b>{treatment.name}</b></p>
                <div className="d-flex justify-content-center mb-2">
 
                </div>
              </MDBCardBody>
            </MDBCard>
                <MDBCard className="mt-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Statistics</span></MDBCardText>
                    
                  </MDBCardBody>
                </MDBCard>            
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
              <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Attributes</span></MDBCardText>

                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Common name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        <MDBCardText className="text-muted">{treatment.name}</MDBCardText>
                    </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                    <MDBCardText>Duration</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                    <MDBCardText className="text-muted">{treatment.duration}</MDBCardText>
                </MDBCol>
                </MDBRow>
                
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="12">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Diseases</span></MDBCardText>
                    <div style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                          <ol className="list-group list-group-numbered">
                            {diseases.map((disease) => (
                              <a href={'/disease/' + disease._key}>
                                <div key={disease._id} className="clickable-div">
                                  <li className="list-group-item  ">
                                    <div className="ms-2 me-auto">
                                      <div className="fw-bold">Name: {disease.name}</div>
                                      <div>Prevalency: {(disease.prevalency * 100).toFixed(2)}%</div>
                                      <div>Mortality: {(disease.mortality * 100).toFixed(2)}%</div>
                                      <div>Transmission: {(disease.transmission * 100).toFixed(2)}%</div>
                                    </div>
                                  </li>
                                </div>
                              </a>
                            ))}
                          </ol>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}