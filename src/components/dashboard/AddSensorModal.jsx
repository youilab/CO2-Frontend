import React, { useContext, useEffect, useState } from "react";
import Swal from 'sweetalert2'

//import { MapConsumer, MapContainer, TileLayer } from 'react-leaflet'



import Modal from "react-modal";
import { AddSensorContext } from "../../context/AddSensorContext";

import "../../assets/css/sensorModal.css";
import axiosClient  from "../../config/axios";

export const AddSensorModal = () => {

    


    const [error, setError] = useState("");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
    },
  };

  Modal.setAppElement("#root");

  const { sensorModal, closeSensorModal } = useContext(AddSensorContext);

  const [formDataSensor, setFormDataSensor] = useState({});
  //const [getCenter, setGetCenter] = useState(false);

  const handleInputChangeSensor = ({target})=> {
    setError('');
    setFormDataSensor({
        ...formDataSensor,
        [target.name]: target.value
    })
  }
  // const getCenterMap = (LatLng)=> {
  //   setFormDataSensor({
  //     ...formDataSensor,
  //     latlong: LatLng.lat +',' + LatLng.lng,
  //   })
  // }

  const setSensor = async(e)=> {
    const inputs = document.querySelectorAll("#serial, #token")
    inputs.forEach(input=> {
        if (input.value === '') {
            setError('Faltan campos por llenar');
            input.classList.add('error-input')
        }else{
            input.classList.remove('error-input')
            setError('');
        }
    })
    if (!error) {
        
        //setGetCenter(true)
        
          
          console.log(formDataSensor);
          const { data } = await axiosClient.post("/user/addSensorUser",formDataSensor );
          if (data.error) {
              setError(data.error);
              return
          }else{
              closeSensorModal()
              Swal.fire(
                'Agregado',
                data.msg,
                'success'
              )
          }
          
        
    }
    

  }


  return (
    <>
      <Modal
        isOpen={sensorModal.open}
        onRequestClose={() => closeSensorModal()}
        style={customStyles}
        className="modal modal-sensor"
        overlayClassName="modal-fondo"
      >
          <div className="modal-content">
            <div className="headerForm">
              <div className="title">Agregar monitor</div>
              <span className="close" onClick={closeSensorModal}>&times; Cerrar</span>
                  { error && <span className='animate__animated animate__repeat-1 animate__slow animate__shakeX' style={{color:"red", display:"flex", justifyContent:"center"}}>{error}</span> }
            </div>
            <div className="form">
                <div className="modal-left">

                    <div className="inputfield">
                    <label htmlFor="serial">Serial</label>
                    <input
                        type="text"
                        id="serial"
                        name="serial"
                        placeholder=""
                        required=""
                        className="input"
                        onChange={handleInputChangeSensor}
                    />
                    <span className="span-text">Ejemplo: 7C:9E:BD:FA:E9:E2</span>
                    </div>
                    <div className="inputfield">
                    <label htmlFor="serial">Token</label>
                    <input
                        type="text"
                        id="token"
                        name="token"
                        placeholder=""
                        className="input"
                        onChange={handleInputChangeSensor}
                    />
                    </div>
                    <div className="inputfield">
                    <label htmlFor="sensorName">Nombre del monitor (opcional)</label>
                    <input
                        type="text"
                        id="sensorName"
                        placeholder="Nombre"
                        name="metadata"
                        onChange={handleInputChangeSensor}
                    />
                    </div>

                    
                </div>
{/*                 Agregar las coordenadas 
                    <div className="right">

                      <div className="inputfield inputfield-map ">
                        <div className="addLocation-form">
                          <div className="inputfield ">
                            <label htmlFor="sensorLocationName">
                                Ubicación del sensor
                            </label>
                           
                          </div>
                          <div className="map-container">
                            <MapContainer center={[22.1511, -100.9783]} zoom={13} scrollWheelZoom={true} >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />
                                <div className="map-marker-centered"></div>
                                {getCenter &&  <MapConsumer>
                                    {(map) => {
                                    const LatLng =  map.getCenter()
                                    getCenterMap(LatLng)
                                    setGetCenter(false)
                                    return null
                                    }}
                                </MapConsumer>}
                            </MapContainer>
                            <div id="mapid" className="map"></div>
                            </div>
                            <span className="location"></span>
                        </div>
                      </div>
                    </div> */}

                
            </div>
                  <button type="submit" className="btn btn-primary" onClick={setSensor}>
                    Agregar <i className="fas fa-plus"></i>{" "}
                  </button>
          </div>
      </Modal>
    </>
  );
};
