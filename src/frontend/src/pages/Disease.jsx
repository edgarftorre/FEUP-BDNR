import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import diseaseIcon from '../assets/images/doença.png'

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
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { BACKEND_URL } from "../config";
import axios from 'axios';


export default function Disease() {
  const {key} = useParams()
  const [disease, setDisease] = useState({name: '', prevalency: '', mortality: '', transmission: '', area: ''}); 
  const [treatments, setTreatments] = useState([])
  const [symptoms, setSymptoms] = useState([])

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getDisease();
    getTreatments();
    getSymptoms();
  }, []);

  const getDisease = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/disease/' + key)
      console.log(response.data)
      setDisease(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }

  const getTreatments = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/treatments/' + key)
      console.log(response.data)
      setTreatments(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }

  const getSymptoms = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/symptoms/' + key)
      console.log(response.data)
      setSymptoms(response.data)
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

              <MDBBreadcrumbItem active>Disease Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={diseaseIcon}
                  alt="avatar"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text mb-1"><b>{disease.name}</b></p>
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
                      <MDBCardText className="text-muted">{disease.name}</MDBCardText>                        
                    </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                    <MDBCardText>Prevalency</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                    <MDBCardText className="text-muted">{(disease.prevalency * 100).toFixed(2)}%</MDBCardText>
                </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Mortality</MDBCardText>    
                    </MDBCol>
                    <MDBCol sm="9">                    
                      <MDBCardText className="text-muted">{(disease.mortality * 100).toFixed(2)}%</MDBCardText>                      
                    </MDBCol>
                </MDBRow>
                <hr />
                
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Transmission</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">                    
                      <MDBCardText className="text-muted">{(disease.transmission * 100).toFixed(2)}%</MDBCardText>
                    </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Area of Specialty</MDBCardText>    
                    </MDBCol>
                    <MDBCol sm="9">                        
                      <MDBCardText className="text-muted">{disease.area}</MDBCardText>
                    </MDBCol>
                </MDBRow>
                
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
            
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Treatments</span></MDBCardText>
                    <div style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                      <ol className="list-group list-group-numbered">
                        {treatments.map(treatment => (
                        <a href={'/treatment/' + treatment._key}>
                          <div key={treatment._id} className="clickable-div">
                            <li key={"treatment" + treatment._key} className="list-group-item ">
                                  <div className="ms-2 me-auto">
                                    <div className="fw-bold">{treatment.name}</div>
                                    <div>Duration(Days): {treatment.duration}</div>
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
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Symptoms</span></MDBCardText>
                    <div style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                    <ol className="list-group list-group-numbered">                    
                        {symptoms.map(symptom => (
                          <a href={'/symptom/' + symptom._key}>
                            <div key={symptom._id} className="clickable-div">
                              <li key={"symptom" + symptom._key} className="list-group-item">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{symptom.name}</div>
                                    <div>Severity: {symptom.severity}</div>
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