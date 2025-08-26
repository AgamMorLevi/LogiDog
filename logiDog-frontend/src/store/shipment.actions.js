import {shipmentService } from '../services/shipment'
import { store } from '../store/store'
import { ADD_SHIPMENT, REMOVE_SHIPMENT, SET_SHIPMENTS, SET_SHIPMENT, UPDATE_SHIPMENT } from './shipment.reducer'

export async function loadShipments(filterBy) {
    try {
        const shipments = await shipmentService.query(filterBy)
        store.dispatch(getCmdSetShipments(shipments))
    } catch (err) {
        console.log('Cannot load shipments', err)
        throw err
    }
}

export async function loadShipment(shipmentId) {
    try {
        const shipment = await shipmentService.getById(shipmentId)
        store.dispatch(getCmdSetShipment(shipment))
    } catch (err) {
        console.log('Cannot load shipment', err)
        throw err
    }
}


export async function removeShipment(shipmentId) {
    try {
        await shipmentService.remove(shipmentId)
        store.dispatch(getCmdRemoveShipment(shipmentId))
    } catch (err) {
        console.log('Cannot remove shipment', err)
        throw err
    }
}

export async function addShipment(shipment) {
    try {
        const savedShipment = await shipmentService.save(shipment)
        store.dispatch(getCmdAddShipment(savedShipment))
        return savedShipment
    } catch (err) {
        console.log('Cannot add shipment', err)
        throw err
    }
}

export async function updateShipment(shipment) {
    try {
        const savedShipment = await shipmentService.save(shipment)
        store.dispatch(getCmdUpdateShipment(savedShipment))
        return savedShipment
    } catch (err) {
        console.log('Cannot save shipment', err)
        throw err
    }
}

export async function addShipmentMsg(shipmentId, txt) {
    try {
        const msg = await shipmentService.addShipmentMsg(shipmentId, txt)
        store.dispatch(getCmdAddShipmentMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add shipment msg', err)
        throw err
    }
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

// unitTestActions()
async function unitTestActions() {
    await loadShipments()
    await addShipment(shipmentService.getEmptyShipment())
    await updateShipment({
        _id: 'm1oC7',
        title: 'Car-Good',
    })
    await removeShipment('m1oC7')
    // TODO unit test addShipmentMsg
}
