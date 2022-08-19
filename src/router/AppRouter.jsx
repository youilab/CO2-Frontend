import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate,  } from "react-router-dom";
import { Admin } from "../components/dashboard/Admin.jsx";
import { DashboardLayoutScreen } from "../components/dashboard/DashboardLayoutScreen.jsx";


import { DashboardScreen } from "../components/dashboard/DashboardScreen.jsx";
import { IPIEstacionScreen } from "../components/dashboard/IPIEstacionScreen.jsx";
import { SensorScreen } from "../components/dashboard/SensorScreen.jsx";
import { ContactScreen } from "../components/home/ContactScreen.jsx";
import { HomeScreen } from "../components/home/HomeScreen.jsx";
import { Layout } from "../components/home/Layout.jsx";
import { ProblemScreen } from "../components/home/ProblemScreen.jsx";
import { SolutionScreen } from "../components/home/SolutionScreen.jsx";
import { AddSensorContext } from "../context/AddSensorContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { AuthModalContext } from "../context/AuthModalContext.jsx";
import { ChangeNameContext } from "../context/ChangeNameContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export const AppRouter = () => {

  const [auth, setAuth] = useState({
    token:'',
    auth: false
  });
  const login =(token)=>{
    setAuth({...auth, token, auth:true})
    localStorage.setItem('token', token)
  }
  const logout =()=>{
    localStorage.setItem('token', '')
    setAuth({...auth, token:'', auth:false})
  }

  useEffect(() => {
    let token = localStorage.getItem("token");
    token ? login(token) : logout();
  }, []);
  useEffect(() => {
    localStorage.setItem("token", auth.token);
  }, [auth]);

  const [modal, setModal] = useState({open:false, content:'login'})

  const openModal =(content="login")=>{
    setModal({...modal, open:true, content})
  }
  const closeModal =()=>{
    setModal({...modal, open:false, content:'login'})
  }
  
  const [sensorModal, setSensorModal] = useState({open:false})

  const openSensorModal =()=>{
    setSensorModal({...sensorModal, open:true})
  }
  const closeSensorModal =()=>{
    setSensorModal({...sensorModal, open:false})
  }

  const [changeNameModal , setChangeNameModal] = useState({open:false, sensor:''})

  const openChangeNameModal =()=>{
    setChangeNameModal({...changeNameModal, open:true})
  }
  const closeChangeNameModal =()=>{
    setChangeNameModal({...changeNameModal, open:false, sensor:''})
  }
  const currentSensorName = (name)=>{
    setChangeNameModal({...changeNameModal,sensor:name})
  }

  const [theme, setTheme] = useState({dark:false})

  


  return (
    <BrowserRouter basename="/co2">
      <AuthModalContext.Provider value={{modal,openModal,closeModal }}>
      <AuthContext.Provider value={{auth, login, logout}}>
      <AddSensorContext.Provider value={{sensorModal, openSensorModal, closeSensorModal}}>
      <ChangeNameContext.Provider value={{changeNameModal, openChangeNameModal, closeChangeNameModal, currentSensorName}}>
      <ThemeContext.Provider value={{theme, setTheme}}>
          <Routes>
            {auth.auth && (
              <Route  path="/dashboard" element={<DashboardLayoutScreen />}>
                <Route index element={<DashboardScreen />} />
                <Route  path="admin" element={<Admin />} />
                <Route  path="sensor/ipiestacion" element={<IPIEstacionScreen />} />
                <Route  path="sensor/:id" element={<SensorScreen />} />
              </Route>
            )}
            {!auth.auth && (
              <Route  path="/" element={<Layout />} >
                <Route index element={<HomeScreen />} />
                <Route  path="/problema" element={<ProblemScreen />} />
                <Route  path="/solucion" element={<SolutionScreen />} />
                <Route  path="/contacto" element={<ContactScreen />} />
              </Route>
            )}


            <Route path="*" element={<Navigate to={auth.auth? "/dashboard"  :  "/"} />} />

          </Routes>

      </ThemeContext.Provider>
      </ChangeNameContext.Provider>
      </AddSensorContext.Provider>
      </AuthContext.Provider>
      </AuthModalContext.Provider>
     
    </BrowserRouter>
  );
};
