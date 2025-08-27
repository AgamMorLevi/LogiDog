import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

    import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { Dashboard } from './pages/Dashboard'
import { ShipmentDetails} from './pages/ShipmentDetails'

export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="shipment/:shipmentId" element={<ShipmentDetails />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}




