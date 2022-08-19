import React, { useContext, useEffect, useState } from "react";
import Swal from 'sweetalert2'

//import { MapConsumer, MapContainer, TileLayer } from 'react-leaflet'



import Modal from "react-modal";

import "../../assets/css/sensorModal.css";
import  axiosClient  from "../../config/axios";
import { ChangeNameContext } from "../../context/ChangeNameContext";
import { useParams } from "react-router-dom";

export const ChangeNameModal = () => {
    const {id} = useParams();

  
    const [formDataSensor, setFormDataSensor] = useState({});
      
   
    
     


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

  const { changeNameModal, closeChangeNameModal } = useContext(ChangeNameContext);


  const handleInputChangeSensor = ({target})=> {
    setError('');
    setFormDataSensor({
        ...formDataSensor,
        [target.name]: target.value,
        serial: id
    })
  }


  const changeName = async(e)=> {
    const input = document.querySelector("#sensorName")
    
    if (input.value === '') {
        setError('Faltan campos por llenar');
        input.classList.add('error-input')
    }else{
        input.classList.remove('error-input')
        setError('');
    }

    if (!error) {
        
        //setGetCenter(true)
       
          console.log(formDataSensor);
          const { data } = await axiosClient.post("/user/changeSensorName",formDataSensor );
          if (data.error) {
              setError(data.error);
              return
          }else{
              closeChangeNameModal()
              Swal.fire(
                'Actualizado',
                data.msg,
                'success'
              ).then(()=>{
                window.location.reload()
              })
          }
          
        
    }
    

  }


  return (
    <>
      <Modal
        isOpen={changeNameModal.open}
        onRequestClose={() => closeChangeNameModal()}
        style={customStyles}
        className="modal modal-sensor"
        overlayClassName="modal-fondo"
      >
          <div className="modal-content">
            <div className="headerForm">
              <div className="title">Cambiar nombre</div>
              <span className="close" onClick={closeChangeNameModal}>&times; Cerrar</span>
                  { error && <span className='animate__animated animate__repeat-1 animate__slow animate__shakeX' style={{color:"red", display:"flex", justifyContent:"center"}}>{error}</span> }
            </div>
            <div className="form">
                <div className="modal-left">

                    
                    <div className="inputfield">
                    <label htmlFor="sensorName">Nombre del sensor</label>
                    <input
                        type="text"
                        id="sensorName"
                        placeholder="Nombre"
                        name="metadata"
                        onChange={handleInputChangeSensor}
                    />
                    </div>

                    
                </div>


                
            </div>
                  <button type="submit" className="btn btn-primary" onClick={changeName}>
                    Cambiar 
                  </button>
          </div>
      </Modal>
    </>
  );
};
