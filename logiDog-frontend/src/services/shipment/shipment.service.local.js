
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

const STORAGE_KEY = 'shipment'

export const shipmentService = {
    query,
    getById,
    save,
    remove
}
window.ss = shipmentService


async function query(filterBy = { txt: '', price: 0 }) {
    var shipments = await storageService.query(STORAGE_KEY)
    const { txt, minSpeed, maxPrice, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        shipments = shipments.filter(shipment => regex.test(shipment.vendor) || regex.test(shipment.description))
    }
    if (minSpeed) {
        shipments = shipments.filter(shipment => shipment.speed <= minSpeed)
    }
    if (maxPrice) {
        shipments = shipments.filter(shipment => shipment.price <= maxPrice)
    }
    if (sortField === 'vendor' || sortField === 'owner') {
        shipments.sort((shipment1, shipment2) =>
            shipment1[sortField].localeCompare(shipment2[sortField]) * +sortDir)
    }
    if (sortField === 'price' || sortField === 'speed') {
        shipments.sort((shipment1, shipment2) =>
            (shipment1[sortField] - shipment2[sortField]) * +sortDir)
    }

    shipments = shipments.map(({ _id, vendor, price, speed, owner }) => ({ _id, vendor, price, speed, owner }))
    return shipments
}

function getById(shipmentId) {
    return storageService.get(STORAGE_KEY, shipmentId)
}

async function remove(shipmentId) {
    await storageService.remove(STORAGE_KEY, shipmentId)
}

async function save(shipment) {
    var savedShipment
    if (shipment._id) {
        const shipmentToSave = {
            _id: shipment._id,
            price: shipment.price,
            speed: shipment.speed,
        }
        savedShipment = await storageService.put(STORAGE_KEY, shipmentToSave)
    } else {
        const shipmentToSave = {
            vendor: shipment.vendor,
            price: shipment.price,
            speed: shipment.speed,
            msgs: []
        }
        savedShipment = await storageService.post(STORAGE_KEY, shipmentToSave)
    }
    return savedShipment
}

