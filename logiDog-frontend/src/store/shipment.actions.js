import { shipmentService } from '../services/shipment'
import { store } from '../store/store'
import { 
    ADD_SHIPMENT, 
    REMOVE_SHIPMENT, 
    SET_SHIPMENTS, 
    SET_SHIPMENT, 
    UPDATE_SHIPMENT,
    SET_AT_RISK_SHIPMENTS,
    SET_DASHBOARD_SUMMARY,
    SET_LOADING,
    SET_ERROR
} from './shipment.reducer'

export async function loadShipments(filterBy = {}) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const shipments = await shipmentService.query(filterBy)
        store.dispatch(getCmdSetShipments(shipments))
        store.dispatch(getCmdSetLoading(false))
    } catch (err) {
        console.log('Cannot load shipments', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function loadShipment(shipmentId) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const shipment = await shipmentService.getById(shipmentId)
        store.dispatch(getCmdSetShipment(shipment))
        store.dispatch(getCmdSetLoading(false))
    } catch (err) {
        console.log('Cannot load shipment', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function removeShipment(shipmentId) {
    try {
        store.dispatch(getCmdSetLoading(true))
        await shipmentService.remove(shipmentId)
        store.dispatch(getCmdRemoveShipment(shipmentId))
        store.dispatch(getCmdSetLoading(false))
    } catch (err) {
        console.log('Cannot remove shipment', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function addShipment(shipment) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const savedShipment = await shipmentService.save(shipment)
        store.dispatch(getCmdAddShipment(savedShipment))
        store.dispatch(getCmdSetLoading(false))
        return savedShipment
    } catch (err) {
        console.log('Cannot add shipment', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function updateShipment(shipment) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const savedShipment = await shipmentService.save(shipment)
        store.dispatch(getCmdUpdateShipment(savedShipment))
        store.dispatch(getCmdSetLoading(false))
        return savedShipment
    } catch (err) {
        console.log('Cannot save shipment', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function updateShipmentStatus(shipmentId, statusUpdate) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const updatedShipment = await shipmentService.updateStatus(shipmentId, statusUpdate)
        store.dispatch(getCmdUpdateShipment(updatedShipment))
        store.dispatch(getCmdSetLoading(false))
        return updatedShipment
    } catch (err) {
        console.log('Cannot update shipment status', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function addDelayReason(shipmentId, delayData) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const updatedShipment = await shipmentService.addDelayReason(shipmentId, delayData)
        store.dispatch(getCmdUpdateShipment(updatedShipment))
        store.dispatch(getCmdSetLoading(false))
        return updatedShipment
    } catch (err) {
        console.log('Cannot add delay reason', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function loadAtRiskShipments(limit = 10) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const atRiskShipments = await shipmentService.getAtRiskShipments(limit)
        store.dispatch(getCmdSetAtRiskShipments(atRiskShipments))
        store.dispatch(getCmdSetLoading(false))
        return atRiskShipments
    } catch (err) {
        console.log('Cannot load at-risk shipments', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function loadDashboardSummary() {
    try {
        store.dispatch(getCmdSetLoading(true))
        const summary = await shipmentService.getDashboardSummary()
        store.dispatch(getCmdSetDashboardSummary(summary))
        store.dispatch(getCmdSetLoading(false))
        return summary
    } catch (err) {
        console.log('Cannot load dashboard summary', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function assessShipmentRisk(shipmentId) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const riskAssessment = await shipmentService.getRiskAssessment(shipmentId)
        // Update the shipment with new risk data
        const shipment = await shipmentService.getById(shipmentId)
        if (shipment) {
            store.dispatch(getCmdUpdateShipment(shipment))
        }
        store.dispatch(getCmdSetLoading(false))
        return riskAssessment
    } catch (err) {
        console.log('Cannot assess shipment risk', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export async function bulkRiskAssessment(shipmentIds) {
    try {
        store.dispatch(getCmdSetLoading(true))
        const assessments = await shipmentService.bulkRiskAssessment(shipmentIds)
        // Reload shipments to get updated risk levels
        await loadShipments()
        store.dispatch(getCmdSetLoading(false))
        return assessments
    } catch (err) {
        console.log('Cannot perform bulk risk assessment', err)
        store.dispatch(getCmdSetError(err.message))
        store.dispatch(getCmdSetLoading(false))
        throw err
    }
}

export function clearError() {
    store.dispatch(getCmdSetError(null))
}

// Command Creators:
function getCmdSetShipments(shipments) {
    return {
        type: SET_SHIPMENTS,
        shipments
    }
}

function getCmdSetShipment(shipment) {
    return {
        type: SET_SHIPMENT,
        shipment
    }
}

function getCmdRemoveShipment(shipmentId) {
    return {
        type: REMOVE_SHIPMENT,
        shipmentId
    }
}

function getCmdAddShipment(shipment) {
    return {
        type: ADD_SHIPMENT,
        shipment
    }
}

function getCmdUpdateShipment(shipment) {
    return {
        type: UPDATE_SHIPMENT,
        shipment
    }
}

function getCmdSetAtRiskShipments(atRiskShipments) {
    return {
        type: SET_AT_RISK_SHIPMENTS,
        atRiskShipments
    }
}

function getCmdSetDashboardSummary(summary) {
    return {
        type: SET_DASHBOARD_SUMMARY,
        summary
    }
}

function getCmdSetLoading(isLoading) {
    return {
        type: SET_LOADING,
        isLoading
    }
}

function getCmdSetError(error) {
    return {
        type: SET_ERROR,
        error
    }
}

// Real-time update handlers
export function handleRealTimeUpdate(update) {
    try {
        switch (update.type) {
            case 'status_update':
                // Reload the specific shipment
                loadShipment(update.shipmentId)
                break
            case 'risk_change':
                // Reload shipments to get updated risk levels
                loadShipments()
                break
            case 'new_shipment':
                // Add new shipment to the list
                loadShipments()
                break
            case 'shipment_deleted':
                // Remove shipment from the list
                store.dispatch(getCmdRemoveShipment(update.shipmentId))
                break
            default:
                // Reload all shipments for unknown updates
                loadShipments()
        }
    } catch (error) {
        console.error('Error handling real-time update:', error)
    }
}

// Initialize real-time updates
export function initializeRealTimeUpdates() {
    try {
        // Try WebSocket first
        const { realtimeService } = require('../services/shipment/shipment.service.remote')
        
        // Connect to WebSocket
        const ws = realtimeService.connectWebSocket(handleRealTimeUpdate)
        
        // Fallback to SSE if WebSocket fails
        ws.onerror = () => {
            console.log('WebSocket failed, trying SSE...')
            const eventSource = realtimeService.connectSSE(handleRealTimeUpdate)
            
            // Fallback to polling if SSE fails
            eventSource.onerror = () => {
                console.log('SSE failed, using polling...')
                realtimeService.startPolling(handleRealTimeUpdate, 30000)
            }
        }
        
        return ws
    } catch (error) {
        console.error('Failed to initialize real-time updates:', error)
        // Use polling as last resort
        try {
            const { realtimeService } = require('../services/shipment/shipment.service.remote')
            return realtimeService.startPolling(handleRealTimeUpdate, 30000)
        } catch (pollingError) {
            console.error('Failed to initialize polling:', pollingError)
        }
    }
}

// unitTestActions()
async function unitTestActions() {
    try {
        await loadShipments()
        await loadDashboardSummary()
        await loadAtRiskShipments()
        
        // Test adding a new shipment
        const newShipment = {
            type: 'consumer goods',
            slaDays: 5,
            expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium',
            origin: 'Shanghai, China',
            destination: 'Tel Aviv, Israel'
        }
        await addShipment(newShipment)
        
        // Test updating status
        await updateShipmentStatus('SHP-001', {
            status: 'IN_TRANSIT',
            location: 'Port of Shanghai'
        })
        
        // Test risk assessment
        await assessShipmentRisk('SHP-001')
        
    } catch (error) {
        console.error('Unit test failed:', error)
    }
}

// Export for testing
if (typeof window !== 'undefined') {
    window.unitTestActions = unitTestActions
}
