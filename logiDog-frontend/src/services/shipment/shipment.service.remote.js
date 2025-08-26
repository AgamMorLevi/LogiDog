import { httpService } from '../http.service'

export const shipmentService = {
    query,
    getById,
    save,
    remove
}

async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get(`shipment`, filterBy)
}

function getById(shipmentId) {
    return httpService.get(`shipment/${shipmentId}`)
}

async function remove(shipmentId) {
    return httpService.delete(`shipment/${shipmentId}`)
}

async function save(shipment) {
    var savedShipment
    if (shipment._id) {
        savedShipment = await httpService.put(`shipment/${shipment._id}`, shipment)
    } else {
        savedShipment = await httpService.post('shipment', shipment)
    }
    return savedShipment
}
