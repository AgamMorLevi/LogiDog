import { httpService } from '../http.service'

export const shipmentService = {
    query,
    getById,
    save,
    remove,
    getAtRiskShipments,
    getDashboardSummary,
    updateStatus,
    addDelayReason,
    assessRisk,
    getRiskAssessment,
    bulkRiskAssessment
}

async function query(filterBy = {}) {
    const queryParams = new URLSearchParams()
    
    // Add filter parameters
    if (filterBy.search) queryParams.append('search', filterBy.search)
    if (filterBy.status && filterBy.status !== 'all') queryParams.append('status', filterBy.status)
    if (filterBy.riskLevel && filterBy.riskLevel !== 'all') queryParams.append('riskLevel', filterBy.riskLevel)
    if (filterBy.type && filterBy.type !== 'all') queryParams.append('type', filterBy.type)
    if (filterBy.sortBy) queryParams.append('sortBy', filterBy.sortBy)
    if (filterBy.sortOrder) queryParams.append('sortOrder', filterBy.sortOrder)
    if (filterBy.page) queryParams.append('page', filterBy.page)
    if (filterBy.limit) queryParams.append('limit', filterBy.limit)

    const queryString = queryParams.toString()
    const url = queryString ? `shipments?${queryString}` : 'shipments'
    
    return httpService.get(url)
}

function getById(shipmentId) {
    return httpService.get(`shipments/${shipmentId}`)
}

async function remove(shipmentId) {
    return httpService.delete(`shipments/${shipmentId}`)
}

async function save(shipment) {
    var savedShipment
    if (shipment.id) {
        savedShipment = await httpService.put(`shipments/${shipment.id}`, shipment)
    } else {
        savedShipment = await httpService.post('shipments', shipment)
    }
    return savedShipment
}

async function getAtRiskShipments(limit = 10) {
    return httpService.get(`dashboard/at-risk?limit=${limit}`)
}

async function getDashboardSummary() {
    return httpService.get('dashboard/summary')
}

async function updateStatus(shipmentId, statusUpdate) {
    return httpService.patch(`shipments/${shipmentId}/status`, statusUpdate)
}

async function addDelayReason(shipmentId, delayData) {
    return httpService.post(`shipments/${shipmentId}/delay-reasons`, delayData)
}

async function assessRisk(shipment) {
    try {
        // Use the risk assessment utility for local calculation
        // In production, you might want to call the API endpoint instead
        const { isShipmentAtRisk, getDetailedRiskAssessment } = await import('../../utils/risk-assessment.js')
        
        const isAtRisk = isShipmentAtRisk(shipment)
        
        if (isAtRisk) {
            const assessment = getDetailedRiskAssessment(shipment)
            return assessment.riskLevel
        } else {
            return 'None'
        }
    } catch (error) {
        console.error('Error assessing risk:', error)
        return 'None'
    }
}

async function getRiskAssessment(shipmentId) {
    return httpService.get(`shipments/${shipmentId}/risk`)
}

async function bulkRiskAssessment(shipmentIds) {
    return httpService.post('shipments/risk-assessment', { shipmentIds })
}

// Real-time updates via WebSocket
export function connectWebSocket(onUpdate) {
    const ws = new WebSocket('wss://api.logidog.com/v1/ws/shipments')
    
    ws.onopen = () => {
        console.log('WebSocket connected for real-time updates')
    }
    
    ws.onmessage = (event) => {
        try {
            const update = JSON.parse(event.data)
            onUpdate(update)
        } catch (error) {
            console.error('Error parsing WebSocket message:', error)
        }
    }
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error)
    }
    
    ws.onclose = () => {
        console.log('WebSocket disconnected')
        // Attempt to reconnect after 5 seconds
        setTimeout(() => connectWebSocket(onUpdate), 5000)
    }
    
    return ws
}

// Server-Sent Events as fallback
export function connectSSE(onUpdate) {
    const eventSource = new EventSource('/v1/shipments/events')
    
    eventSource.onmessage = (event) => {
        try {
            const update = JSON.parse(event.data)
            onUpdate(update)
        } catch (error) {
            console.error('Error parsing SSE message:', error)
        }
    }
    
    eventSource.onerror = (error) => {
        console.error('SSE error:', error)
        eventSource.close()
    }
    
    return eventSource
}

// Polling fallback for real-time updates
export function startPolling(onUpdate, interval = 30000) {
    let pollInterval
    
    const poll = async () => {
        try {
            // Get latest shipments and check for updates
            const shipments = await query({ limit: 100 })
            onUpdate({ type: 'poll_update', shipments })
        } catch (error) {
            console.error('Polling error:', error)
        }
    }
    
    // Start polling
    pollInterval = setInterval(poll, interval)
    
    // Return function to stop polling
    return () => {
        if (pollInterval) {
            clearInterval(pollInterval)
            pollInterval = null
        }
    }
}

// Export real-time connection methods
export const realtimeService = {
    connectWebSocket,
    connectSSE,
    startPolling
}
