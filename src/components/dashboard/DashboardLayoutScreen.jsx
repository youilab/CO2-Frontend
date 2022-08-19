import React from 'react'
import { Outlet } from 'react-router-dom'
import { Aside } from '../ui/Aside'
import { AddSensorModal } from './AddSensorModal'
import { ChangeNameModal } from './ChangeNameModal'

export const DashboardLayoutScreen = () => {
 
    
    return (
        <div className='dashboard-container'>
           
                <Aside/>
                <AddSensorModal />
                <ChangeNameModal />
                <div className="dashboard-main">
                    <Outlet  />

                </div>


           
        </div>
    )
}
