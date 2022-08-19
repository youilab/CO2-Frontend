import React from 'react'
import '../../assets/css/contact.css'

export const ContactScreen = () => {
    return (
        <div className='contact-container'>
            <h1>Ponte en contacto</h1>
            <div className="fomr-contact">
                <div className="inputfield">
                    <label htmlFor="">
                        Tu nombre
                    </label>
                        <input type="text"  />
                </div>
                <div className="inputfield">
                        <label >
                        Tu correo
                    </label>
                        <input type="text"  />
                </div>
                <div className="inputfield">
                    <label >
                        Asunto
                    </label>
                    <input type="text"  />

                </div>
                <div className="inputfield">
                    <label >
                        Mensaje
                    </label>
                    <textarea name="" id="" cols="30" rows="10"></textarea>

                </div>
                <div className="actions">
                    <button className="btn btn-primary">Enviar</button>
                </div>

            </div>
        </div>
    )
}
