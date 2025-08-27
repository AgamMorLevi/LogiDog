import React from 'react'
import { useNavigate } from 'react-router-dom'

export function ShipmentsList({ shipments, groupedShipments, onEditShipment }) {
    const navigate = useNavigate()

    function handleViewShipment (shipmentId) {
        console.log('Navigating to shipment:', shipmentId)
        navigate(`/shipment/${shipmentId}`)
    }

    function handleEditShipment (shipment){
        if (onEditShipment) {
            onEditShipment(shipment)
        }
        // TODO: Implement edit functionality
        console.log('Edit shipment:', shipment.id)
    }

    function shipmentRow(shipment){
        
        return (
            <div key={shipment.id} className={`shipment- ${shipment.id}`}>
                <div className="shipment-info">
                    <div className="shipment-header">
                        <span className="shipment-id">{shipment.id}</span>
                    </div>
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