import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'

import { AuthModalContext } from '../../context/AuthModalContext';

import { useForm } from "react-hook-form";
import axiosClient from '../../config/axios';
import {  useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';



export const LoginForm = () => {

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {  login } = useContext(AuthContext);
    const { openModal,closeModal } = useContext(AuthModalContext);
    const { register, handleSubmit, formState: { errors } } = useForm();

    
    


    const onSubmit = async(formData) => {
        try {
            const res = await axiosClient.post('/user/login', formData);
            console.log(res);
            if (res.status === 200 ) {
                const {data} = res; 
                if (data.error) {
                    setError(data.msg)
                }else{
                    const {token} = data;
                    login(token)
                    navigate("/dashboard");
                }
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: res.status,
                })            
            }
            
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: "Error en servidor",
            })      
        }
    }

    const togglePassword = (e)=> {
        const input = e.target;
        const password = document.getElementById('password')
        console.log(password)
        input.classList.toggle('fa-eye')
        input.classList.toggle('fa-eye-slash')
        input.classList.contains('fa-eye-slash')? password.type="text" :password.type="password"
        
    }




    return (
        <div className="modal-content">

        <div className="headerForm">
            <div className="title">
                Iniciar Sesión
            </div>
            <span className="close" onClick={closeModal}>&times; Cerrar</span>
        </div>
        <div className="form">
            <form  onSubmit={handleSubmit(onSubmit)} noValidate id="login">
            { error && <span className='animate__animated animate__repeat-1 animate__slow animate__shakeX' style={{color:"red", display:"flex", justifyContent:"center"}}>{error}</span> }
                <div className="inputfield">
                    <label htmlFor="email">Correo:</label>
                    <input 
                        id='email'
                        type="email"  
                        {...register("username", { 
                            required: {
                                value: true, 
                                message: 'el email es requerido'
                                },
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Formato de correo incorrecto"
                            }  
                        })} 
                    />
                    {errors.email && <span className= "error"  aria-live="polite"> {errors.email.message}</span>}
                </div>

                <div className="inputfield">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" 
                            {...register("password", { 
                                required: {
                                    value: true, 
                                    message: 'La contraseña es requerida'
                                    },
                                minLength: {
                                    value: 5, 
                                    message: 'Contraseña de al menos 5 caracteres'
                                }, })}
                            placeholder="********"  
                    />
                    <i className="fas fa-eye "  onClick={togglePassword}></i>
                    {errors.password && <span className="error" aria-live="polite"> {errors.password.message}</span>}
                </div>

                <label className="labels">¿Olvidaste tu contraseña?<i className="forgotten-password">Click aquí.</i></label>
                <div className="inputfield">
                    <button type="submit" className="btn btn-primary">Enviar <i className="fas fa-paper-plane"></i> </button>

                </div>
            </form>

            <label className="labels" onClick={()=> openModal('signup')} >¿Aún no tienes cuenta?<i id="btnModalReg" className="btn btn-secundary">Regístrate
                    aquí.</i></label>
        </div>
    </div>
    )
}
