import { httpService } from './http.service'

export const shipmentService = {
  query,
  getById,
  save,
  remove,
  updateStatus,
  addDelayReason
}

async function query(filterBy = {}) {
  return httpService.get('shipments', filterBy)
}

function getById(shipmentId) {
  return httpService.get(`shipments/${shipmentId}`)
}

async function save(shipment) {
  return shipment.id
    ? httpService.put(`shipments/${shipment.id}`, shipment)
    : httpService.post('shipments', shipment)
}

async function remove(shipmentId) {
  return httpService.delete(`shipments/${shipmentId}`)
}


async function updateStatus(shipmentId, statusUpdate) {
  return httpService.patch(`shipments/${shipmentId}/status`, statusUpdate)
}

async function addDelayReason(shipmentId, delayData) {
  return httpService.post(`shipments/${shipmentId}/delay-reasons`, delayData)
}