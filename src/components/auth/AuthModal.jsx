import React, { useContext } from 'react'
import Modal from 'react-modal';
import { AuthModalContext } from '../../context/AuthModalContext';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import '../../assets/css/authModal.css'


export const AuthModal = ( ) => {
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
  
        },
    };
    Modal.setAppElement('#root');

    const { modal, closeModal } = useContext(AuthModalContext);


    return (
        <Modal
        isOpen={modal.open}
        onRequestClose={ ()=>closeModal() }
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        >
            {
                modal.content === 'login'? 
                <LoginForm/>
                :
                <SignUpForm/>
            }
        </Modal>
    )
}
