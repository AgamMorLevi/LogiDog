export const SET_SHIPMENTS = 'SET_SHIPMENTS'
export const SET_SHIPMENT = 'SET_SHIPMENT'
export const REMOVE_SHIPMENT = 'REMOVE_SHIPMENT'
export const ADD_SHIPMENT = 'ADD_SHIPMENT'
export const UPDATE_SHIPMENT = 'UPDATE_SHIPMENT'
export const SET_AT_RISK_SHIPMENTS = 'SET_AT_RISK_SHIPMENTS'
export const SET_DASHBOARD_SUMMARY = 'SET_DASHBOARD_SUMMARY'
export const SET_LOADING = 'SET_LOADING'
export const SET_ERROR = 'SET_ERROR'

const initialState = {
    shipments: [],
    shipment: null,
    atRiskShipments: [],
    dashboardSummary: null,
    isLoading: false,
    error: null,
    lastRemovedShipment: null
}

export function shipmentReducer(state = initialState, action) {
    var newState = state
    var shipments
    
    switch (action.type) {
        case SET_SHIPMENTS:
            newState = { ...state, shipments: action.shipments }
            break
            
        case SET_SHIPMENT:
            newState = { ...state, shipment: action.shipment }
            break
            
        case REMOVE_SHIPMENT:
            const lastRemovedShipment = state.shipments.find(shipment => shipment.id === action.shipmentId)
            shipments = state.shipments.filter(shipment => shipment.id !== action.shipmentId)
            newState = { 
                ...state, 
                shipments, 
                lastRemovedShipment,
                // Also remove from at-risk shipments if present
                atRiskShipments: state.atRiskShipments.filter(shipment => shipment.id !== action.shipmentId)
            }
            break
            
        case ADD_SHIPMENT:
            newState = { ...state, shipments: [...state.shipments, action.shipment] }
            // Add to at-risk shipments if applicable
            if (action.shipment.riskLevel === 'AtRisk' || action.shipment.riskLevel === 'Delayed') {
                newState.atRiskShipments = [...state.atRiskShipments, action.shipment]
            }
            break
            
        case UPDATE_SHIPMENT:
            shipments = state.shipments.map(shipment => 
                (shipment.id === action.shipment.id) ? action.shipment : shipment
            )
            
            // Update at-risk shipments
            let atRiskShipments = state.atRiskShipments.map(shipment => 
                (shipment.id === action.shipment.id) ? action.shipment : shipment
            )
            
            // Remove from at-risk if no longer at risk
            if (action.shipment.riskLevel === 'None') {
                atRiskShipments = atRiskShipments.filter(shipment => shipment.id !== action.shipment.id)
            }
            
            // Add to at-risk if newly at risk
            if ((action.shipment.riskLevel === 'AtRisk' || action.shipment.riskLevel === 'Delayed') && 
                !state.atRiskShipments.find(s => s.id === action.shipment.id)) {
                atRiskShipments = [...atRiskShipments, action.shipment]
            }
            
            newState = { 
                ...state, 
                shipments,
                atRiskShipments,
                // Update current shipment if it's the one being updated
                shipment: state.shipment && state.shipment.id === action.shipment.id 
                    ? action.shipment 
                    : state.shipment
            }
            break
            
        case SET_AT_RISK_SHIPMENTS:
            newState = { ...state, atRiskShipments: action.atRiskShipments }
            break
            
        case SET_DASHBOARD_SUMMARY:
            newState = { ...state, dashboardSummary: action.summary }
            break
            
        case SET_LOADING:
            newState = { ...state, isLoading: action.isLoading }
            break
            
        case SET_ERROR:
            newState = { ...state, error: action.error }
            break
            
        default:
            return state
    }
    
    return newState
}

// Selectors for easy access to state
export function selectAllShipments(state) {
    return state.shipmentModule.shipments
}

export function selectShipmentById(state, shipmentId) {
    return state.shipmentModule.shipments.find(shipment => shipment.id === shipmentId)
}

export function selectCurrentShipment(state) {
    return state.shipmentModule.shipment
}

export function selectAtRiskShipments(state) {
    return state.shipmentModule.atRiskShipments
}

export function selectDashboardSummary(state) {
    return state.shipmentModule.dashboardSummary
}

export function selectIsLoading(state) {
    return state.shipmentModule.isLoading
}

export function selectError(state) {
    return state.shipmentModule.error
}

export function selectShipmentsByStatus(state, status) {
    return state.shipmentModule.shipments.filter(shipment => shipment.status === status)
}

export function selectShipmentsByRiskLevel(state, riskLevel) {
    return state.shipmentModule.shipments.filter(shipment => shipment.riskLevel === riskLevel)
}

export function selectShipmentsByType(state, type) {
    return state.shipmentModule.shipments.filter(shipment => shipment.type === type)
}

export function selectShipmentsByPriority(state, priority) {
    return state.shipmentModule.shipments.filter(shipment => shipment.priority === priority)
}

export function selectOverdueShipments(state) {
    const now = new Date()
    return state.shipmentModule.shipments.filter(shipment => {
        const expected = new Date(shipment.expectedDelivery)
        return expected < now
    })
}

export function selectShipmentsNeedingAttention(state) {
    return state.shipmentModule.shipments.filter(shipment => {
        const now = new Date()
        const expected = new Date(shipment.expectedDelivery)
        const daysUntilDeadline = Math.ceil((expected - now) / (1000 * 60 * 60 * 24))
        
        return shipment.riskLevel === 'AtRisk' || 
               shipment.riskLevel === 'Delayed' || 
               daysUntilDeadline <= 2
    })
}

// unitTestReducer()
function unitTestReducer() {
    var state = initialState
    
    const shipment1 = { 
        id: 'SHP-001', 
        type: 'consumer goods',
        status: 'IN_TRANSIT',
        riskLevel: 'AtRisk',
        slaDays: 5,
        expectedDelivery: '2025-01-25T12:00:00Z',
        createdDate: '2025-01-20T08:00:00Z',
        lastUpdate: '2025-01-20T10:30:00Z',
        delayReason: 'Weather delay',
        currentLocation: 'Port of Shanghai',
        priority: 'high'
    }
    
    const shipment2 = { 
        id: 'SHP-002', 
        type: 'medical equipment',
        status: 'CUSTOMS_HOLD',
        riskLevel: 'Delayed',
        slaDays: 3,
        expectedDelivery: '2025-01-23T12:00:00Z',
        createdDate: '2025-01-19T10:15:00Z',
        lastUpdate: '2025-01-20T08:15:00Z',
        delayReason: 'Documentation issues',
        currentLocation: 'Customs Warehouse',
        priority: 'critical'
    }

    console.log('Initial state:', state)

    // Test SET_SHIPMENTS
    state = shipmentReducer(state, { type: SET_SHIPMENTS, shipments: [shipment1, shipment2] })
    console.log('After SET_SHIPMENTS:', state)

    // Test ADD_SHIPMENT
    const shipment3 = { 
        id: 'SHP-003', 
        type: 'light industry',
        status: 'AT_WAREHOUSE',
        riskLevel: 'None',
        slaDays: 7,
        expectedDelivery: '2025-01-27T12:00:00Z',
        createdDate: '2025-01-18T14:30:00Z',
        lastUpdate: '2025-01-20T16:20:00Z',
        delayReason: null,
        currentLocation: 'Main Warehouse',
        priority: 'medium'
    }
    state = shipmentReducer(state, { type: ADD_SHIPMENT, shipment: shipment3 })
    console.log('After ADD_SHIPMENT:', state)

    // Test UPDATE_SHIPMENT
    const updatedShipment1 = { ...shipment1, riskLevel: 'None', status: 'DELIVERED' }
    state = shipmentReducer(state, { type: UPDATE_SHIPMENT, shipment: updatedShipment1 })
    console.log('After UPDATE_SHIPMENT:', state)

    // Test SET_AT_RISK_SHIPMENTS
    state = shipmentReducer(state, { type: SET_AT_RISK_SHIPMENTS, atRiskShipments: [shipment2] })
    console.log('After SET_AT_RISK_SHIPMENTS:', state)

    // Test SET_DASHBOARD_SUMMARY
    const summary = {
        totalShipments: 3,
        atRisk: 1,
        delayed: 1,
        overdue: 0,
        onTime: 1,
        delivered: 1
    }
    state = shipmentReducer(state, { type: SET_DASHBOARD_SUMMARY, summary })
    console.log('After SET_DASHBOARD_SUMMARY:', state)

    // Test SET_LOADING
    state = shipmentReducer(state, { type: SET_LOADING, isLoading: true })
    console.log('After SET_LOADING:', state)

    // Test SET_ERROR
    state = shipmentReducer(state, { type: SET_ERROR, error: 'Test error message' })
    console.log('After SET_ERROR:', state)

    // Test REMOVE_SHIPMENT
    state = shipmentReducer(state, { type: REMOVE_SHIPMENT, shipmentId: 'SHP-002' })
    console.log('After REMOVE_SHIPMENT:', state)

    // Test clearing error
    state = shipmentReducer(state, { type: SET_ERROR, error: null })
    console.log('After clearing error:', state)

    // Test setting loading to false
    state = shipmentReducer(state, { type: SET_LOADING, isLoading: false })
    console.log('Final state:', state)
}

// Export for testing
if (typeof window !== 'undefined') {
    window.unitTestReducer = unitTestReducer
}

