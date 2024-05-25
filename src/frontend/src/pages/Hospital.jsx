import { useParams } from 'react-router-dom';
import hospitalIconImage from '../assets/images/hospital.png'

import React, { useState, useEffect } from 'react';
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

const AddPacient = ({ hospitalKey, showModal, setShowModal }) => {
  const [basicModal, setBasicModal] = useState(false);

  const [formData, setFormData] = useState({
      name: '',
      age: '',
      weight:'',
      height:'',
  });

  const toggleShow = () => {
      setBasicModal(!basicModal);
    };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform desired actions with the form data
    console.log(formData);
    createPatient(formData)
    createPatientHospital(formData)

    // Clear the form fields
    setFormData({ name: '', age: '', weight: '', height: '' });
    // Close the modal
    toggleShow();
  };

  const createPatient = async (formData) =>{
    try{
        const response = await axios.post(BACKEND_URL + `/api/patient/`,{
            name: formData.name,
            age: formData.age,
            height: formData.height,
            weight: formData.weight
        });
        console.log(response.data)
    } catch (error) {
        console.error(error); // Handle any errors
    }
  }

  const createPatientHospital = async (formData) =>{
    try{
        const response = await axios.post(BACKEND_URL + `/api/patient/`+ hospitalKey,{
            name: formData.name,
            age: formData.age,
            height: formData.height,
            weight: formData.weight
        });
        console.log(response.data)
    } catch (error) {
        console.error(error); // Handle any errors
    }
  }

    return (
        <>
          <MDBBtn className="me-1" color="success" onClick={toggleShow}>
            Add New Pacient
          </MDBBtn>
          <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Modal title</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
          </MDBModalHeader>
          <form onSubmit={handleSubmit}>
            <MDBModalBody>
              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                  type='text'
                  className='form-control'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Age</label>
                <input
                  type='number'
                  className='form-control'
                  id='age'
                  name='age'
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='phone'>Weight</label>
                <input
                  type='number'
                  className='form-control'
                  id='weight'
                  name='weight'
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='phone'>Height</label>
                <input
                  type='number'
                  className='form-control'
                  id='height'
                  name='height'
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn type='submit'>Save changes</MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
        </>
      );
    };

export default function Hospital() {
  const { key } = useParams();

  const [hospital, setHospital] = useState({name: '', size: '', workForce: '', bedNumber: ''})
  const [statistic, setStatistics] = useState({averageMortality: 0, treatmentCount2: 0, maxSymptomsName: 0, minSymptomsName: 0})

  const [formData, setFormData] = useState({name: '', size: '', workForce: '', bedNumber: ''})
  const [patients, setPatients] = useState([])

  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getStatistics();
    getHospital();
    getPatients();
  }, []);

  const handleEdit = () => {
    if (!editing)
      setFormData(hospital)
    else{
      const changedFields = {};

      for (const field in formData) 
          if (formData[field] !== hospital[field] && formData[field] !== "")           
              changedFields[field] = formData[field];
      
      if (Object.keys(changedFields).length !== 0){
        editHospital(formData)
      }
    }
    setEditing(!editing);
    
  };

  function handleEditChange(field, event) { 
    setFormData({...formData, [field]: event.target.value});
  }

  const getHospital = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/hospital/' + key)
      setHospital(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }

  const getStatistics = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/hospital/' + key + "/statistics")
      console.log("STATISTICS")
      console.log(response.data)
      setStatistics(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }

  const editHospital = async (formData) =>{
    try{
        const response = await axios.put(BACKEND_URL + `/api/hospital/` + key,{
            name: formData.name,
            size: formData.size,
            workForce: formData.workForce,
            bedNumber: formData.bedNumber
        });
        console.log(response.data)
        getHospital()
    } catch (error) {
        console.error(error); // Handle any errors
    }
}

  const getPatients = async () => {
    try{
      const response = await axios.get(BACKEND_URL + '/api/patients/' + key)
      setPatients(response.data)
    } catch(error){
      console.error(error); // Handle any errors
    }
  }

  async function handleDelete(deleteKey, event) { 
    try{
      const response = await axios.delete(BACKEND_URL + '/api/patient/' + deleteKey)
      console.log(response.data)
      getPatients()
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

              <MDBBreadcrumbItem active>Hospital Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={hospitalIconImage}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted mb-4"><b>{hospital.name}</b></p>
                <div className="d-flex justify-content-center mb-2">
                <AddPacient hospitalKey = {key} showModal={showModal} setShowModal={setShowModal} />
                <MDBBtn className="me-1" color="warning" onClick={handleEdit}>
                  {editing ? 'Save Changes' : 'Edit Hospital'}
                </MDBBtn>
 
                </div>
              </MDBCardBody>
            </MDBCard>
                <MDBCard className="mt-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Statistics</span></MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>
                      <b>Average Mortality</b>: {(statistic.averageMortality * 100).toFixed(2)}%
                    </MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>
                      <b>Number of different treatments:</b>: {(statistic.treatmentCount2 )}
                    </MDBCardText>

                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>
                      <b>Least Ocurrent Symptom:</b>: {(statistic.maxSymptomsName )}
                    </MDBCardText>

                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>
                      <b>Most Ocurrent Symptom:</b>: {(statistic.minSymptomsName )}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
              <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">Attributes</span></MDBCardText>

                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        {editing ? (
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name || hospital.name}
                            onChange={(event) => handleEditChange("name", event)}
                        />
                        ) : (
                        <MDBCardText className="text-muted">{hospital.name}</MDBCardText>
                        )}
                    </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                    <MDBCardText>Size</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                    {editing ? (
                    <input
                        type="text"
                        className="form-control"
                        value={formData.size || hospital.size}
                        onChange={(event) => handleEditChange("size", event)}
                    />
                    ) : (
                    <MDBCardText className="text-muted">{hospital.size}</MDBCardText>
                    )}
                </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Workforce</MDBCardText>    
                    </MDBCol>
                    <MDBCol sm="9">
                        {editing ? (
                        <input
                            type="text"
                            className="form-control"
                            value={formData.workForce || hospital.workForce}
                            onChange={(event) => handleEditChange("workForce", event)}
                        />
                        ) : (
                        <MDBCardText className="text-muted">{hospital.workForce}</MDBCardText>
                        )}
                    </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Bed Number</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        {editing ? (
                        <input
                            type="text"
                            className="form-control"
                            value={formData.bedNumber || hospital.bedNumber}
                            onChange={(event) => handleEditChange("bedNumber", event)}
                        />
                        ) : (
                        <MDBCardText className="text-muted">{hospital.bedNumber}</MDBCardText>
                        )}
                    </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
            
          <MDBRow>
            
              <MDBCol md="18">
              <MDBCard className="mb-4 mb-md-0">
                <MDBCardBody style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                  <MDBCardText className="mb-4">
                    <span className="text-primary font-italic me-1">Patients</span>
                  </MDBCardText>
                  <div style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                    <ol className="list-group list-group-numbered">
                      {patients.map((patient) => (
                        <li className="list-group-item d-flex justify-content-between ">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">Name: {patient.name}</div>
                            <div>Age: {patient.age}</div>
                            <div>Height: {patient.height}</div>
                            <div>Weight: {patient.weight}</div>
                          </div>
                          <MDBBtn
                            className="me-1 mt-3"
                            key={"delete" + patient._key}
                            onClick={(event) => handleDelete(patient._key, event)}
                            color="danger"
                          >
                            Delete
                          </MDBBtn>
                        </li>
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