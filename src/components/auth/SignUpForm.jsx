import React, { useContext, useState } from 'react'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'


import { AuthModalContext } from '../../context/AuthModalContext';
import axiosClient from "../../config/axios";


export const SignUpForm = () => {

    const [error, setError] = useState("");

    const {  closeModal } = useContext(AuthModalContext);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const togglePassword = (e)=> {
        const input = e.target;
        const password = document.getElementById('password')
        console.log(password)
        input.classList.toggle('fa-eye')
        input.classList.toggle('fa-eye-slash')
        input.classList.contains('fa-eye-slash')? password.type="text" :password.type="password"
        
    }

    const onSubmit = async(formData) => {
        console.log(formData);
        const res = await axiosClient.post('/user/register', formData);
        
        if (res.status === 200 ) {
            const {data} = res; 
            if (data.error) {
                setError(data.msg)
            }else{
                Swal.fire({
                    icon: 'success',
                    title: 'Listo!',
                    text: data.msg,
                }).then(()=>{
                    closeModal()
                })
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: "Error en servidor",
                
            })            
        }

    }


    return (
        <div className="modal-content">
            <div className="headerForm">
                <div className="title">
                    Regístrate
                </div>
                <span className="close" onClick={closeModal}>&times; Cerrar</span>
            </div>
            <div className="form">
                <form onSubmit={handleSubmit(onSubmit)} noValidate id="signUp">
                    { error && <span className='animate__animated animate__repeat-1 animate__slow animate__shakeX' style={{color:"red", display:"flex", justifyContent:"center"}}>{error}</span> }
                    <div className="inputfield">
                        <label htmlFor="name">Nombre completo:</label>
                        <input 
                        type="text" 
                        id='name'
                        {...register("name", { 
                            required: {
                                value: true, 
                                message: 'El nombre es requerido'
                            }
                        })} 
                    />
                    {errors.name && <span className= "error"  aria-live="polite"> {errors.name.message}</span>}
                    </div>
                    <div id="email-div" className="inputfield">
                        <label htmlFor="email">Correo:</label>
                        <input 
                        type="email"  
                        id='email'
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
                        <input type="password" id='password'
                        {...register("password", { 
                            required: {
                                value: true, 
                                message: 'la contraseña es requerida'
                                },
                            minLength: {
                                value: 5, 
                                message: 'Contraseña de al menos 5 caracteres'
                            } 
                        })} 
                    />
                    {errors.password && <span className= "error"  aria-live="polite"> {errors.password.message}</span>}
                        <i className="fas fa-eye" onClick={togglePassword}></i>
                    </div>
                    {/* <!-- <div className="inputfield terms">
                        <label className="check">
                            <input type="checkbox" />
                            <span>Acepto los </span><span className="checkmark">términos y condiciones</span>
                            <span className="error error-check" aria-live="polite"></span>
                        </label>
                    </div> --> */}
                    <div className="inputfield">
                        <button type="submit" className="btn btn-primary">Enviar <i className="fas fa-paper-plane"></i> </button>
                        <button type="button" className="btn btn-secundary"> Ya tengo una cuenta <i
                                className="fas fa-user"></i></button>

                    </div>
                </form>
            </div>
        </div>
    )
}
