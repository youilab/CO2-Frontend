import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import "../../assets/css/dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import { AddSensorContext } from "../../context/AddSensorContext";
import axiosClient  from "../../config/axios";
import Swal from 'sweetalert2'


export const Aside = () => {


  const { sensorModal, openSensorModal } = useContext(AddSensorContext);

  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [sensors, setSensors] = useState([]);
  const [changeUserName, setChangeUserName] = useState(false);
  // const [changeAvatar, setChangeAvatar] = useState(false);

  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = async(event) => {
    const fileUploaded = event.target.files[0];
    const extencion = fileUploaded.name.split('.')[1]
    
    Object.defineProperty(fileUploaded, 'name', {
      writable: true,
      value: user._id+'.'+extencion
    });
    console.log(fileUploaded)
    const formData = new FormData();
    formData.append('user',user._id)
    formData.append('avatar',fileUploaded)
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Accept': 'application/json'
        }
    }
    await axiosClient.post('/user/avatar', formData, config)  
  };

  const changeName = async(e) => {
    e.preventDefault()
    console.log(e.target[0]);
    const { data } = await axiosClient.post("/user/name",{name:e.target[0].value, id:user._id } );
    if (data.error) {
      Swal.fire(
        'Error',
        data.error,
        'error'
      )
    }else{
      setUser({...user, name:e.target[0].value })
      Swal.fire(
        'Agregado',
        data.msg,
        'success'
      )
    }
    setChangeUserName(false)
  };

  const getUserInfo = async() => {
    try {
      const {data} = await axiosClient.get(`user/`)
      console.log(data)
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
      <aside>
        <div className="aside-close-session">
          <button className="btn btn-secundary" onClick={() => logout()}>
            Cerrar sesion
          </button>
        </div>
        <div className="profile-picture responsive">
          <div className="profile-picture-container">
            <img
              src={
                user.avatar
                  // Localhost 
                  //  ? `http://localhost:3005/avatars/${user._id}.jpeg`
                  // : "./assets/img/profile.jpg"
                  //Production mode
                  ? `https://148.207.219.61/co2-bkn/avatars/${user._id}.jpeg`
                  : "./assets/img/profile.jpg"
              }
              alt=""
            />
          </div>
          <form className="edit-avatar">
            <div className="profile-picture-change-icon">
            
              <label htmlFor="avatar"  onClick={handleClick}>
                <i className="far fa-edit"></i>
              </label>
                <input type="file"
                        accept='image/*'
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        style={{display:'none'}} 
              />               
            </div>
          </form>
        </div>
        <div className="profile-name responsive-hide">
          {
            !changeUserName && 
            <h4 className="profile-name-txt"> {user.name || user.username} </h4>
          }
          <form onSubmit={changeName}>
            <div className="">
              {
                !changeUserName && 
                <label htmlFor="name" className="btn" id="edit-name" onClick={()=>setChangeUserName(true)}>
                  <i className="far fa-edit"></i>
                </label>
              }
              {
                changeUserName &&
                <input
                  defaultValue={user.name || user.username || ""}
                  type="text"
                  name="name"
                  id="name"
                />
              }
            </div>
            {
              changeUserName &&
              <button id="name-save" className="btn">
                Guardar<i className="fas fa-save"></i>
              </button>
            }
          </form>
        </div>
        <div className="profile-locations-container">
          <div className="profile-locations-title">
          <i className="fas fa-tablet"></i>
            <h2 className="responsive-hide">Sensores</h2>
          </div>

          <div className="profile-locations responsive-hide">
            {sensors.length !== 0 ? (
              sensors.map((sensor, i) => (
                <React.Fragment key={sensor._id + i}>
                  
                    <NavLink className={(navData) => navData.isActive ? "active btn btn-primary" : "btn btn-primary" }  to={`sensor/${sensor.serial}`} ><i className="fas fa-tablet-alt"></i> {user.sensors[i] && user.sensors[i].name? user.sensors[i].name: sensor.serial} </NavLink> 
                   
                </ React.Fragment>
              ))
            ) : (
              <>
                <p>No hay sensores</p>
                <button onClick={()=> openSensorModal()} className="btn btn-primary">Agregar</button>
              </>
            )}
              <NavLink className={(navData) => navData.isActive ? "active btn btn-primary" : "btn btn-primary" }  to={`sensor/ipiestacion`} ><i className="fas fa-tablet-alt"></i> IPIEstacion </NavLink> 
          </div>
        </div>
        {sensors.length !== 0 ? (
            <button onClick={()=> openSensorModal()} className="addSensor-modal-open btn btn-secundary">
              <span className="responsive-hide" >Agregar sensor</span>
              <i className="fas fa-plus responsive"></i>{" "}
            </button>
          )
          : (
            <>
          </>
            )
        }
        {
          user && user.rol === 'admin' && 
          <>
            <NavLink className={(navData) => navData.isActive ? "active btn btn-primary" : "btn btn-primary" }  to={`admin`} ><i className="fa-solid fa-screwdriver-wrench"></i> PANEL ADMINISTRATIVO </NavLink> 
          </>
        }
        
      </aside>
    </>
  );
};
