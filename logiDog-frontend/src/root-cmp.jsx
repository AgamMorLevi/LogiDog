import React from 'react'
import { Routes, Route, Navigate } from 'react-router'


export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <main>
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="shipments" element={<ShipmentsIndex />} />  
                    <Route path="shipments/:shipmentId" element={<ShipmentDetails />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}




