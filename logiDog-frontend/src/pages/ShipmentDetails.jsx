import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getStatusLabel, getStatusColor } from '../services/statuses'
import { getSLAStatus } from '../utils/dashboard-calculations'
import './ShipmentDetails.scss'

export function ShipmentDetails() {
    const { shipmentId } = useParams()
    const { shipments } = useSelector(state => state.shipmentModule)

    console.log('ShipmentDetails rendered with shipmentId:', shipmentId)
    console.log('ShipmentDetails - all shipments:', shipments)

    // Find the shipment from the existing shipments in store
    const shipment = shipments.find(s => s.id === shipmentId)
    
    console.log('ShipmentDetails - found shipment:', shipment)

    // If shipment not found, show error
    if (!shipment) {
        return (
            <div className="shipment-details not-found">
                <h2>Shipment not found</h2>
                <p>Shipment with ID {shipmentId} was not found in the system.</p>
                <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
            </div>
        )
    }

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error) {
            return 'Invalid Date'
        }
    }

    const slaStatus = getSLAStatus(shipment)

    return (
        <div className="shipment-details">
            {/* Header */}
            <div className="shipment-header">
                <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
                <h1>Shipment Details: {shipment.id}</h1>
            </div>

            {/* Main Info */}
            <div className="shipment-main-info">
                <div className="info-card">
                    <div className="card-header">
                        <h2>Basic Information</h2>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Shipment ID:</span>
                            <span className="value">{shipment.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Type:</span>
                            <span className="value">{shipment.type}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Priority:</span>
                            <span className="value">{shipment.priority}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Status:</span>
                            <span 
                                className="status-badge" 
                                style={{ backgroundColor: getStatusColor(shipment.status) }}
                            >
                                {getStatusLabel(shipment.status)}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Current Location:</span>
                            <span className="value">{shipment.currentLocation}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Created Date:</span>
                            <span className="value">{formatDate(shipment.createdDate)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Expected Delivery:</span>
                            <span className="value">{formatDate(shipment.expectedDelivery)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Last Update:</span>
                            <span className="value">{formatDate(shipment.lastUpdate)}</span>
                        </div>
                    </div>
                </div>

                {/* Risk Assessment */}
                <div className="info-card risk-card">
                    <div className="card-header">
                        <h2>Risk Assessment</h2>
                    </div>
                    <div className="risk-info">
                        <div className="risk-status">
                            <span className="label">Risk Level:</span>
                            <span className={`risk-badge ${shipment.riskLevel?.toLowerCase()}`}>
                                {shipment.riskLevel || 'None'}
                            </span>
                        </div>
                        
                        {shipment.delayReason && (
                            <div className="delay-reason">
                                <span className="label">Delay Reason:</span>
                                <span className="value warning">{shipment.delayReason}</span>
                            </div>
                        )}

                        <div className="sla-info">
                            <span className="label">SLA Status:</span>
                            <div className="sla-details">
                                <span className={`sla-badge ${slaStatus.status.isOverdue ? 'overdue' : 'normal'}`}>
                                    {slaStatus.status.isOverdue ? 
                                        `${Math.round(slaStatus.status.elapsed)}h overdue` :
                                        `${Math.round(slaStatus.status.remaining)}h remaining`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="info-card timeline-card">
                    <div className="card-header">
                        <h2>Timeline</h2>
                    </div>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-date">{formatDate(shipment.createdDate)}</div>
                            <div className="timeline-content">
                                <h4>Shipment Created</h4>
                                <p>Shipment {shipment.id} was created and is ready for pickup</p>
                            </div>
                        </div>
                        
                        {shipment.statusUpdatedAt && (
                            <div className="timeline-item">
                                <div className="timeline-date">{formatDate(shipment.statusUpdatedAt)}</div>
                                <div className="timeline-content">
                                    <h4>Status Updated</h4>
                                    <p>Status changed to {getStatusLabel(shipment.status)}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="timeline-item">
                            <div className="timeline-date">{formatDate(shipment.lastUpdate)}</div>
                            <div className="timeline-content">
                                <h4>Last Update</h4>
                                <p>Shipment information was last updated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="shipment-actions">
                <button className="action-btn edit-btn">
                    Edit Shipment
                </button>
                <button className="action-btn status-btn">
                    Update Status
                </button>
                <button className="action-btn contact-btn">
                    Contact Support
                </button>
            </div>
        </div>
    )
}