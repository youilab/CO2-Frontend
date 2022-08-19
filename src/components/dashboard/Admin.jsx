import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../../config/axios';
import Swal from 'sweetalert2'


const typeSensor = {
  CO2: {
    units: 'ppm'
  },
  Humedad: {
    units: '%'
  },
  PM1: {
    units: 'ug/m³'
  },
  PM10: {
    units: 'ug/m³'
  },
  PM25: {
    units: 'ug/m³'
  },
  PM4: {
    units: 'ug/m³'
  },
  Temperatura: {
    units: '°C'
  },
  COVs: {
    units: 'ppb'
  },
  Ethanol: {
    units: 'ppm'
  },
  H2: {
    units: 'ppm'
  },
  'Humedad absoluta': {
    units: 'm³/gr'
  },
}
const initialState = {
  serial:"",
  type:"CO2",
  units:"ppm",
  token:"1234",
  latlong:"22.149631, -101.035683",
  metadata: ""
}

export const Admin = () => {
  const [error, setError] = useState("");

  const [formDataSensor, setFormDataSensor] = useState(initialState);
  

  const handleInputChangeSensor = ({target})=> {
    setError('');
    const units = typeSensor[formDataSensor.type].units
    setFormDataSensor({
        ...formDataSensor,
        units,
        [target.name]: target.value
    })
  }

  const setSensor = async(e)=> {
    const inputs = document.querySelectorAll("#serial, #metadata")
    let errorFlag = false 
    inputs.forEach(input=> {
        if (input.value === '') {
            setError('Faltan campos por llenar');
            errorFlag=true
            input.classList.add('error-input')
        }else{
            input.classList.remove('error-input')
            setError('');
        }
    })
    if (!error && !errorFlag) {
          console.log(formDataSensor);
          const { data } = await axiosClient.post("/sensor/",formDataSensor );
          if (data.error) {
              setError(data.error);
              return
          }else{
             
              Swal.fire(
                'Agregado',
                data.msg,
                'success'
              )
              setFormDataSensor(initialState)
          }

    }
    

  }



  return <>
    <>
    <h1 className='sensor-name'>PANEL ADMINISTRATIVO </h1>

  
    <section>
      <h2>Agregar sensor</h2>
      <div className="form">
      { error && <span className='animate__animated animate__repeat-1 animate__slow animate__shakeX' style={{color:"red", display:"flex", justifyContent:"center"}}>{error}</span> }

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
                        value={formDataSensor.serial }
                        onChange={handleInputChangeSensor}
                    />
                    <span className="span-text">Ejemplo: 7C:9E:BD:FA:E9:E2</span>
                    </div>
                    <div className="inputfield">
                    <label htmlFor="serial">Token (opcional)</label>
                    <input
                        type="text"
                        id="token"
                        name="token"
                        placeholder="1234"
                        className="input"
                        value={formDataSensor.token }
                        onChange={handleInputChangeSensor}
                    />
                    <span className="span-text">Si no se asigna, por defecto se asigna 1234 como token</span>

                    <div className="inputfield">
                    <label htmlFor="type">Tipo</label>
                    <select name="type" id="type" onChange={handleInputChangeSensor} value={formDataSensor.type }>
                      {
                        Object.keys(typeSensor).map(type=>(
                          <option value={type}>{type}</option>

                        ))
                      }
                    </select>
                    <span className="span-text">Las unidades se asignan automaticamente</span>
                    </div>
                    </div>
                    <div className="inputfield">
                    <label htmlFor="metadata">Descripción (metadata)</label>
                    <input
                        type="text"
                        id="metadata"
                        placeholder="Nombre"
                        name="metadata"
                        value={formDataSensor.metadata }
                        onChange={handleInputChangeSensor}
                    />
                    </div>
                    <div className="inputfield">
                    <label htmlFor="latlong">Ubicación (opcional)</label>
                    <input
                        type="text"
                        id="latlong"
                        placeholder="22.149631, -101.035683"
                        name="latlong"
                        value={formDataSensor.latlong }
                        onChange={handleInputChangeSensor}
                    />
                    <span className="span-text">Si no se asigna, por defecto se asignan las coordenadas del IPICYT</span>
                    </div>

                    
                </div>
              </div>
              <button type="submit" className="btn btn-primary" onClick={setSensor} style={{marginTop:"2rem", backgroundColor: "var(--naranja)",width: "60%"}}>
                    Agregar <i className="fas fa-plus"></i>{" "}
                  </button>
    </section>
   
    
    </>
  
      
  </>;
};
