import React, { useState, useEffect } from "react";
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
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // import leaflet
import hospitalIconImage from '../assets/images/hospital.png'
import axios from 'axios';
import { BACKEND_URL } from "../config";

export default function HomeTest() {
    const [hospitals, setHospitals] = useState([]);

    const position = [55.3781, -3.4360]; // Latitude and longitude coordinates of the UK
    const zoom = 6; // Zoom level to display the entire country

    var HospitalIcon = L.Icon.extend({
        options: {
            iconSize:     [38, 38],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
        }
    });

    var hospitalIcon = new HospitalIcon({iconUrl: hospitalIconImage})

    const getHospitals = async () => {

      const response = await axios.get(BACKEND_URL + '/api/hospitals');
      console.log(response)
      setHospitals(response.data);
    };

    useEffect(() => {
      getHospitals();
    }, );

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
      <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <a href='/'>Home</a>
              </MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBCard className="mb-4">
              <MDBCardBody>
              <div className= 'flex justify-center items-center'>
                        <div className="box-container border-4 border-blue-500 rounded-md overflow-hidden">                
                            <MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                />
                                {hospitals.map((hospital) => (
                                  <Marker position={[hospital.x, hospital.y]} icon={hospitalIcon}>
                                      <Popup>
                                      <MDBBtn href={`/hospital/${hospital._key}`} className='me-1'>
                                        View Hospital
                                      </MDBBtn>
                                      </Popup>
                                  </Marker>
                                ))}
                                
                            </MapContainer>
                        </div>
            </div>
                
              </MDBCardBody>
            </MDBCard>
        <MDBCard className="mb-4">
            <MDBCardBody>
            <MDBBtn href= "/diseaseList" className='me-1'>
                Disease List
            </MDBBtn>

            
            </MDBCardBody>
        </MDBCard>

      </MDBContainer>
    </section>
  );
}