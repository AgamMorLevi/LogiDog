const { DEV, VITE_LOCAL } = import.meta.env
import { getRandomIntInclusive, makeId } from '../util.service'

import { shipmentService as local } from './shipment.service.local'
import { shipmentService as remote } from './shipment.service.remote'

function getEmptyShipment() {
    return {
        vendor: makeId(),
        price: getRandomIntInclusive(1000, 9000),
        speed: getRandomIntInclusive(80, 240),
    }
}                   
   


function getDefaultFilter() {
    return {
        txt: '',
        maxPrice: '',
        minSpeed: '',
        sortField: '',
        sortDir: '',
        // pageIdx: 0
    }
}

// console.log('VITE_LOCAL:', VITE_LOCAL)

const service = VITE_LOCAL === 'true' ? local : remote
export const shipmentService = { getEmptyShipment, getDefaultFilter, ...service }

if (DEV) window.shipmentService = shipmentService
