import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

const STORAGE_KEY = 'shipment'

export const shipmentService = {
  query,
  getById,
  save,
  remove,
  updateStatus,
  addDelayReason,
  getAtRiskShipments,
  getDashboardSummary,
  assessRisk,
}
window.ss = shipmentService

/** שאילתת משלוחים עם סינונים ומיון */
async function query(filterBy = {}) {
  let shipments = await storageService.query(STORAGE_KEY)

  const {
    search = '',
    status = 'all',        // 'all' | 'new' | 'inProgress' | 'completed'
    showDelayed = false,
    showAtRisk = false,
    type = 'all',
    priority = 'all',
    sortField = 'riskLevel', // שדה מיון: riskLevel/slaDays/createdDate/expectedDelivery/priority…
    sortDir = -1,             // כיוון מיון: -1 ל־desc, 1 ל־asc
  } = filterBy

  // חיפוש חופשי במזהה, סוג משלוח או מיקום נוכחי
  if (search) {
    const regex = new RegExp(search, 'i')
    shipments = shipments.filter(
      sh =>
        regex.test(sh.id) ||
        regex.test(sh.type) ||
        regex.test(sh.currentLocation)
    )
  }

  // חלוקה לעמודות הדשבורד
  if (status !== 'all') {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)

    const newStatuses = ['WAITING_FOR_PICKUP', 'PICKED_UP']
    const inProgressStatuses = [
      'AT_WAREHOUSE',
      'HEADING_TO_PORT',
      'IN_TRANSIT',
      'CUSTOMS',
      'CUSTOMS_HOLD',
      'RELEASEED',
      'OUT_FOR_DELIVERY',
    ]
    const completedStatuses = [
      'DELIVERED',
      'DELIVERY_ATTEMPT_FAILED',
      'RETURNED_TO_SENDER',
      'CANCELLED',
      'LOST',
    ]

    shipments = shipments.filter(sh => {
      const created = new Date(sh.createdDate)
      if (status === 'new') {
        return (
          created >= todayStart &&
          created >= twelveHoursAgo &&
          newStatuses.includes(sh.status)
        )
      } else if (status === 'inProgress') {
        return inProgressStatuses.includes(sh.status)
      } else if (status === 'completed') {
        return completedStatuses.includes(sh.status)
      }
      return true
    })
  }

  if (showDelayed) {
    shipments = shipments.filter(sh => sh.riskLevel === 'Delayed')
  }

  if (showAtRisk) {
    shipments = shipments.filter(sh => sh.riskLevel === 'AtRisk')
  }

  if (type !== 'all') {
    shipments = shipments.filter(sh => sh.type === type)
  }

  if (priority !== 'all') {
    shipments = shipments.filter(sh => sh.priority === priority)
  }

  shipments.sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    if (sortField === 'riskLevel') {
      const order = { Delayed: 3, AtRisk: 2, None: 1 }
      aVal = order[a.riskLevel] || 0
      bVal = order[b.riskLevel] || 0
    } else if (
      sortField === 'createdDate' ||
      sortField === 'expectedDelivery'
    ) {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }

    if (typeof aVal === 'string') {
      return sortDir * aVal.localeCompare(bVal)
    } else {
      return sortDir * (aVal - bVal)
    }
  })

  return shipments
}

function getById(shipmentId) {
  return storageService.get(STORAGE_KEY, shipmentId)
}

async function remove(shipmentId) {
  await storageService.remove(STORAGE_KEY, shipmentId)
}

async function save(shipment) {
  let savedShipment
  if (shipment.id) {
    const toSave = {
      id: shipment.id,
      createdDate: shipment.createdDate,
      type: shipment.type,
      slaDays: shipment.slaDays,
      status: shipment.status,
      riskLevel: shipment.riskLevel,
      expectedDelivery: shipment.expectedDelivery,
      lastUpdate: shipment.lastUpdate,
      delayReason: shipment.delayReason,
      currentLocation: shipment.currentLocation,
      priority: shipment.priority,
    }
    savedShipment = await storageService.put(STORAGE_KEY, toSave)
  } else {
    const toSave = {
      id: `SHP-${makeId()}`,
      createdDate: new Date().toISOString(),
      type: shipment.type,
      slaDays: shipment.slaDays,
      status: 'WAITING_FOR_PICKUP',
      riskLevel: 'None',
      expectedDelivery: shipment.expectedDelivery,
      lastUpdate: new Date().toISOString(),
      delayReason: null,
      currentLocation: shipment.origin || 'Origin Warehouse',
      priority: shipment.priority || 'medium',
    }
    savedShipment = await storageService.post(STORAGE_KEY, toSave)
  }

  if (savedShipment && typeof assessRisk === 'function') {
    savedShipment.riskLevel = await assessRisk(savedShipment)
    await storageService.put(STORAGE_KEY, savedShipment)
  }

  return savedShipment
}

async function updateStatus(shipmentId, { status, location, delayReason }) {
  const shipment = await storageService.get(STORAGE_KEY, shipmentId)
  if (!shipment) throw new Error('Shipment not found')

  shipment.status = status
  shipment.currentLocation = location || shipment.currentLocation
  shipment.lastUpdate = new Date().toISOString()

  if (delayReason) {
    shipment.delayReason = delayReason
  }

  if (typeof assessRisk === 'function') {
    shipment.riskLevel = await assessRisk(shipment)
  }

  return storageService.put(STORAGE_KEY, shipment)
}


async function addDelayReason(shipmentId, { reason }) {
  const shipment = await storageService.get(STORAGE_KEY, shipmentId)
  if (!shipment) throw new Error('Shipment not found')

  shipment.delayReason = reason
  shipment.lastUpdate = new Date().toISOString()

  if (typeof assessRisk === 'function') {
    shipment.riskLevel = await assessRisk(shipment)
  }

  return storageService.put(STORAGE_KEY, shipment)
}

/** החזרת כל המשלוחים שברמת סיכון או בעיכוב */
async function getAtRiskShipments() {
  const shipments = await storageService.query(STORAGE_KEY)
  return shipments.filter(
    sh => sh.riskLevel === 'AtRisk' || sh.riskLevel === 'Delayed',
  )
}


async function getDashboardSummary() {
  const shipments = await storageService.query(STORAGE_KEY)
  const now = new Date()

  const summary = {
    totalShipments: shipments.length,
    atRisk: shipments.filter(s => s.riskLevel === 'AtRisk').length,
    delayed: shipments.filter(s => s.riskLevel === 'Delayed').length,
    overdue: shipments.filter(s => new Date(s.expectedDelivery) < now).length,
    onTime: shipments.filter(
      s => new Date(s.expectedDelivery) >= now && s.riskLevel === 'None',
    ).length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
  }

  summary.byType = shipments.reduce((acc, sh) => {
    acc[sh.type] = (acc[sh.type] || 0) + 1
    return acc
  }, {})

  summary.byStatus = shipments.reduce((acc, sh) => {
    acc[sh.status] = (acc[sh.status] || 0) + 1
    return acc
  }, {})

  return summary
}

async function assessRisk(shipment) {
  return shipment.riskLevel || 'None'
}