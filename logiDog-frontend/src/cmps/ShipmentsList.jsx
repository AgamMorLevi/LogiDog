import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getStatusLabel, getStatusColor } from '../services/statuses'
import './ShipmentsList.scss'

export function ShipmentsList({ shipments, groupedShipments, onEditShipment }) {
    const navigate = useNavigate()

    const handleViewShipment = (shipmentId) => {
        console.log('Navigating to shipment:', shipmentId)
        navigate(`/shipment/${shipmentId}`)
    }

    const handleEditShipment = (shipment) => {
        if (onEditShipment) {
            onEditShipment(shipment)
        }
        // TODO: Implement edit functionality
        console.log('Edit shipment:', shipment.id)
    }

    const getRowColorClass = (shipment) => {
        // This will be calculated by the service, not in the component
        if (shipment.isDelayed) return 'row-delayed'
        if (shipment.isAtRisk) return 'row-at-risk'
        return 'row-normal'
    }

    const renderShipmentRow = (shipment) => {
        const colorClass = getRowColorClass(shipment)
        
        return (
            <div key={shipment.id} className={`shipment-row ${colorClass}`}>
                <div className="shipment-info">
                    <div className="shipment-header">
                        <span className="shipment-id">{shipment.id}</span>
                        <span className="priority-badge">
                            {shipment.priority}
                        </span>
                    </div>
                    
                    <div className="shipment-details">
                        <div className="type-info">
                            {shipment.type}
                        </div>
                        
                        <div className="status-info">
                            <span 
                                className="status-badge" 
                                style={{ backgroundColor: getStatusColor(shipment.status) }}
                            >
                                {getStatusLabel(shipment.status)}
                            </span>
                        </div>
                        
                        <div className="location-info">
                            {shipment.currentLocation}
                        </div>
                    </div>
                </div>
                
                <div className="shipment-actions">
                    <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditShipment(shipment)}
                        title="Edit Shipment"
                    >
                        Edit
                    </button>
                    
                    <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewShipment(shipment.id)}
                        title="View Details"
                    >
                        View
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="shipments-list-container">
            <div className="shipments-columns">
                {/* New Column */}
                <div className="shipment-column new-column">
                    <div className="column-header">
                        <h3>New ({groupedShipments.new?.length || 0})</h3>
                    </div>
                    <div className="shipments-list">
                        {groupedShipments.new?.map(renderShipmentRow) || []}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="shipment-column in-progress-column">
                    <div className="column-header">
                        <h3>In Progress ({groupedShipments.inProgress?.length || 0})</h3>
                    </div>
                    <div className="shipments-list">
                        {groupedShipments.inProgress?.map(renderShipmentRow) || []}
                    </div>
                </div>

                {/* Completed Column */}
                <div className="shipment-column completed-column">
                    <div className="column-header">
                        <h3>Completed ({groupedShipments.completed?.length || 0})</h3>
                    </div>
                    <div className="shipments-list">
                        {groupedShipments.completed?.map(renderShipmentRow) || []}
                    </div>
                </div>
            </div>
        </div>
    )
}