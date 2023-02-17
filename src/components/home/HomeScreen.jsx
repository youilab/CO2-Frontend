import React, { useContext, useEffect } from "react";
//css
import "../../assets/css/home.css";

//Components
import landing from "../../assets/img/landing.jpg";
import { AuthModalContext } from "../../context/AuthModalContext";
import { ThemeContext } from "../../context/ThemeContext";

export const HomeScreen = () => {

  const {  openModal } = useContext(AuthModalContext);
  const {  setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme({dark:false})
  }, []);

  return (
    <div>
      <div
        className="home-img"
        style={{ backgroundImage: `url(${landing})` }}
      ></div>
      <div className="home-img layout"></div>

      <main className="container">
        <div className="main-text ">
          <h1 className="animate__animated animate__fadeInDown animate__delay-1s">
            Centinela del Aire
          </h1>
          <div className="main-sign-up animate__animated animate__fadeInDown animate__delay-2s">
            <button id="registrarse" onClick={ ()=> openModal('signup') }>Unete</button>
          </div>
        </div>
       
      </main>

    </div>
  );
};
