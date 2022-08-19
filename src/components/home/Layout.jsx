import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthModal } from '../auth/AuthModal.jsx'
import { Header } from '../ui/Header.jsx'

export const Layout = () => {
 
    
    return (
        <div>
           
                <Header  />
                <Outlet  />
                <AuthModal   />


           
        </div>
    )
}
