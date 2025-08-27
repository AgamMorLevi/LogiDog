import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { shipmentService } from '../services/shipment/shipment.service.local'
import { SET_SHIPMENTS } from '../store/shipment.reducer'
import { ShipmentFilter } from '../cmps/ShipmentFilter'
import { ShipmentsList } from '../cmps/ShipmentsList'
import { getDashboardSummary } from '../utils/dashboard-calculations'
import './Dashboard.scss'

export function Dashboard() {
    const dispatch = useDispatch()
    const { shipments } = useSelector(state => state.shipmentModule)
    
    const [filters, setFilters] = useState({
        status: 'all',
        showDelayed: false,
        showAtRisk: false,
        type: 'all',
        priority: 'all'
    })
    
    const [error, setError] = useState(null)

    useEffect(() => {
        loadShipments()
    }, [])

    // Reload shipments when filters change
    useEffect(() => {
        loadShipments()
    }, [filters])

    // Real-time updates every minute
    useEffect(() => {
        const interval = setInterval(() => {
            loadShipments()
        }, 60000) // 60 seconds

        return () => clearInterval(interval)
    }, [filters])

    const loadShipments = async () => {
        try {
            setError(null)
            const shipmentsData = await shipmentService.query(filters)
            dispatch({ type: SET_SHIPMENTS, shipments: shipmentsData })
        } catch (error) {
            console.error('Failed to load shipments:', error)
            setError('Failed to load shipments. Please try again.')
        }
    }

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }))
    }
    
    const handleEditShipment = (shipment) => {
        console.log('Edit shipment:', shipment.id)
    }

    const summary = getDashboardSummary(shipments)

    console.log('Dashboard - shipments:', shipments)
    console.log('Dashboard - summary:', summary)
    console.log('Dashboard - grouped shipments:', summary.grouped)

    if (error) {
        return (
            <div className="dashboard">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={loadShipments}>Retry</button>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {/* Header Section */}
            <div className="dashboard-header">
                <h1>LogiDog Dashboard</h1>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <span className="stat-number">{summary.total.count}</span>
                        <span className="stat-label">Total Shipments</span>
                    </div>
                    <div className="stat-card warning">
                        <span className="stat-number">{summary.total.atRisk}</span>
                        <span className="stat-label">At Risk</span>
                    </div>
                    <div className="stat-card danger">
                        <span className="stat-number">{summary.total.delayed}</span>
                        <span className="stat-label">Delayed</span>
                    </div>
                </div>
            </div>

            <ShipmentFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
            />
            
            <ShipmentsList 
                shipments={shipments}
                groupedShipments={summary.grouped}
                onEditShipment={handleEditShipment}
            />
        </div>
    )
}

