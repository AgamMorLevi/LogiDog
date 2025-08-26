export const SET_SHIPMENTS = 'SET_CARS'
export const SET_SHIPMENT = 'SET_CAR'
export const REMOVE_SHIPMENT = 'REMOVE_CAR'
export const ADD_SHIPMENT = 'ADD_CAR'
export const UPDATE_SHIPMENT = 'UPDATE_CAR'

const initialState = {
    shipments: [],
    shipment: null
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
            const lastRemovedShipment = state.shipments.find(shipment => shipment._id === action.shipmentId)
            shipments = state.shipments.filter(shipment => shipment._id !== action.shipmentId)
            newState = { ...state, shipments, lastRemovedShipment }
            break
        case ADD_SHIPMENT:
            newState = { ...state, shipments: [...state.shipments, action.shipment] }
            break
        case UPDATE_SHIPMENT:
            shipments = state.shipments.map(shipment => (shipment._id === action.shipment._id) ? action.shipment : shipment)
            newState = { ...state, shipments }
            break
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const shipment1 = { _id: 'b101', vendor: 'Shipment ' + parseInt(Math.random() * 10), msgs: [] }
    const shipment2 = { _id: 'b102', vendor: 'Shipment ' + parseInt(Math.random() * 10), msgs: [] }

    state = shipmentReducer(state, { type: SET_SHIPMENTS, shipments: [shipment1] })
    console.log('After SET_SHIPMENTS:', state)

    state = shipmentReducer(state, { type: ADD_SHIPMENT, shipment: shipment2 })
    console.log('After ADD_SHIPMENT:', state)

    state = shipmentReducer(state, { type: UPDATE_SHIPMENT, shipment: { ...shipment2, vendor: 'Good' } })
    console.log('After UPDATE_SHIPMENT:', state)

    state = shipmentReducer(state, { type: REMOVE_SHIPMENT, shipmentId: shipment2._id })
    console.log('After REMOVE_SHIPMENT:', state)

    state = shipmentReducer(state, { type: REMOVE_SHIPMENT, shipmentId: shipment1._id })
    console.log('After REMOVE_SHIPMENT:', state)
}

