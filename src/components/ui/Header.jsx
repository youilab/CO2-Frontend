import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import '../../assets/css/navbar.css'
import { AuthModalContext } from "../../context/AuthModalContext";
import { ThemeContext } from "../../context/ThemeContext";



export const Header = () => {

  const {  openModal } = useContext(AuthModalContext);
  const {  theme } = useContext(ThemeContext);


  return (
    <>
      <nav>
        <div className="nav-logo">
          <Link to="/" style={{color:'white', fontSize:'xx-large'}} >Logo </Link>
        </div>
        <div className="nav-links">
          <ul className="responsive-hide" style={theme.dark? {color:"black"} :{color:"white"}  } >
            <li>
              <NavLink  to="/problema" className={(navData) => navData.isActive ? "active" : "" } id="problema">
                Problema
              </NavLink >
            </li>
            <li>
              <NavLink  to="/solucion" className={(navData) => navData.isActive ? "active" : "" } id="solucion">
                Solucion
              </NavLink >
            </li>
            <li>
              <NavLink  to="/contacto" className={(navData) => navData.isActive ? "active" : "" } id="contacto">
                Contacto
              </NavLink >
            </li>
          </ul>
        </div>
        <div className="login" onClick={()=> openModal() } style={theme.dark? {color:"black"} :{color:"white"}  }  >
          <i className="fas fa-user"></i>
          <span className="responsive-hide">Iniciar sesion</span>{" "}
        </div>
      </nav>

    
    </>

  );
};
