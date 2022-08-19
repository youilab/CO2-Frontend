import React, { useContext, useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import '../../assets/css/dashboard.css'

import { AddSensorContext } from "../../context/AddSensorContext";
//import { AuthContext } from '../../context/AuthContext';
import  axiosClient  from '../../config/axios';
//import { Link } from 'react-router-dom';


export const DashboardScreen = () => {
    const [sensors, setSensors] = useState([]);
    const { sensorModal } = useContext(AddSensorContext);
    const [user, setUser] = useState({});
    const [types, setTypes] = useState({});


    const getUserInfo = async() => {
      try {
        const {data} = await axiosClient.get(`user/`)
        setUser(data.usuario);
        setSensors(data.usuario.sensors)
      } catch (error) {
        console.log(error);
      }
    };
  
  
    useEffect(() => {
      getUserInfo();
    }, [ sensorModal]);
    
    return (
        <>
            {
                sensors.length !==0 ?
                <>
                    <h1>Bienvenido, {user.name}</h1>
                    <p>Tienes {sensors.length} sensores agregados</p> 
                    <br />
                    
                </>
                :
                <>
                    <div className="no-sensors">
                      <h2>Aun no tienes sensores agregados</h2>
                      <p>Si no has adquirido alguno, ponte en contacto</p>
                    </div>
                    <br />
                    <div className="with-sensors">
                      <p> ¿Tienes un sensor?</p>
                      <button className='btn btn-primary' style={{border: '1px solid' }}>Agregar</button>
                    </div>
                </>
            }
        </>


            
    )
}
