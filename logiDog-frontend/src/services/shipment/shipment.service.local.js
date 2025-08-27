
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { isShipmentAtRisk, getDetailedRiskAssessment } from '../../utils/risk-assessment.js'

const STORAGE_KEY = 'shipment'

export const shipmentService = {
    query,
    getById,
    save,
    remove,
    getAtRiskShipments,
    getDashboardSummary,
    updateStatus,
    addDelayReason,
    assessRisk
}
window.ss = shipmentService

async function query(filterBy = {}) {
    var shipments = await storageService.query(STORAGE_KEY)
    const { 
        search = '', 
        status = 'all', 
        showDelayed = false,
        showAtRisk = false,
        type = 'all',
        priority = 'all',
        sortBy = 'riskLevel',
        sortOrder = 'desc'
    } = filterBy

    // Search filter
    if (search) {
        const regex = new RegExp(search, 'i')
        shipments = shipments.filter(shipment => 
            regex.test(shipment.id) || 
            regex.test(shipment.type) ||
            regex.test(shipment.currentLocation)
        )
    }

    // Status filter - handle new column logic
    if (status !== 'all') {
        if (status === 'new') {
            // Filter for New column: today only, max 12 hours, and in 'new' statuses
            const now = new Date()
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000))
            
            shipments = shipments.filter(shipment => {
                const created = new Date(shipment.createdDate)
                const isToday = created >= todayStart
                const isWithin12Hours = created >= twelveHoursAgo
                const isNewStatus = ['WAITING_FOR_PICKUP', 'PICKED_UP'].includes(shipment.status)
                
                return isToday && isWithin12Hours && isNewStatus
            })
        } else if (status === 'inProgress') {
            // Filter for In Progress column
            const inProgressStatuses = ['AT_WAREHOUSE', 'HEADING_TO_PORT', 'IN_TRANSIT', 'CUSTOMS', 'CUSTOMS_HOLD', 'RELEASED', 'OUT_FOR_DELIVERY']
            shipments = shipments.filter(shipment => inProgressStatuses.includes(shipment.status))
        } else if (status === 'completed') {
            // Filter for Completed column
            const completedStatuses = ['DELIVERED', 'DELIVERY_ATTEMPT_FAILED', 'RETURNED_TO_SENDER', 'CANCELLED', 'LOST']
            shipments = shipments.filter(shipment => completedStatuses.includes(shipment.status))
        }
    }

    // Risk and Delay filters
    if (showDelayed) {
        shipments = shipments.filter(shipment => {
            // Import the calculation functions
            const { isShipmentDelayed } = require('../../utils/dashboard-calculations')
            return isShipmentDelayed(shipment)
        })
    }

    if (showAtRisk) {
        shipments = shipments.filter(shipment => {
            // Import the calculation functions
            const { isShipmentAtRisk } = require('../../utils/dashboard-calculations')
            return isShipmentAtRisk(shipment)
        })
    }

    // Type filter
    if (type !== 'all') {
        shipments = shipments.filter(shipment => shipment.type === type)
    }

    // Priority filter
    if (priority !== 'all') {
        shipments = shipments.filter(shipment => shipment.priority === priority)
    }

    // Sorting
    shipments.sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
            case 'riskLevel':
                const riskOrder = { 'AtRisk': 3, 'Delayed': 2, 'None': 1 }
                aValue = riskOrder[a.riskLevel] || 0
                bValue = riskOrder[b.riskLevel] || 0
                break
            case 'sla':
                aValue = a.slaDays
                bValue = b.slaDays
                break
            case 'date':
                aValue = new Date(a.createdDate)
                bValue = new Date(b.createdDate)
                break
            case 'expectedDelivery':
                aValue = new Date(a.expectedDelivery)
                bValue = new Date(b.expectedDelivery)
                break
            default:
                aValue = a[sortBy]
                bValue = b[sortBy]
        }

        if (typeof aValue === 'string') {
            return sortOrder === 'desc' 
                ? bValue.localeCompare(aValue)
                : aValue.localeCompare(bValue)
        } else {
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
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
    var savedShipment
    if (shipment.id) {
        // Update existing shipment
        const shipmentToSave = {
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
            priority: shipment.priority
        }
        savedShipment = await storageService.put(STORAGE_KEY, shipmentToSave)
    } else {
        // Create new shipment
        const shipmentToSave = {
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
            priority: shipment.priority || 'medium'
        }
        savedShipment = await storageService.post(STORAGE_KEY, shipmentToSave)
    }

    // Assess risk after save
    if (savedShipment) {
        savedShipment.riskLevel = await assessRisk(savedShipment)
    }

    return savedShipment
}

async function getAtRiskShipments() {
    const shipments = await storageService.query(STORAGE_KEY)
    return shipments.filter(shipment => 
        shipment.riskLevel === 'AtRisk' || 
        shipment.riskLevel === 'Delayed'
    )
}

async function getDashboardSummary() {
    const shipments = await storageService.query(STORAGE_KEY)
    const now = new Date()
    
    const summary = {
        totalShipments: shipments.length,
        atRisk: shipments.filter(s => s.riskLevel === 'AtRisk').length,
        delayed: shipments.filter(s => s.riskLevel === 'Delayed').length,
        overdue: shipments.filter(s => {
            const expected = new Date(s.expectedDelivery)
            return expected < now
        }).length,
        onTime: shipments.filter(s => {
            const expected = new Date(s.expectedDelivery)
            return expected >= now && s.riskLevel === 'None'
        }).length,
        delivered: shipments.filter(s => s.status === 'DELIVERED').length
    }

    // Group by type
    summary.byType = shipments.reduce((acc, shipment) => {
        acc[shipment.type] = (acc[shipment.type] || 0) + 1
        return acc
    }, {})

    // Group by status
    summary.byStatus = shipments.reduce((acc, shipment) => {
        acc[shipment.status] = (acc[shipment.status] || 0) + 1
        return acc
    }, {})

    return summary
}

async function updateStatus(shipmentId, statusUpdate) {
    const shipment = await storageService.get(STORAGE_KEY, shipmentId)
    if (!shipment) {
        throw new Error('Shipment not found')
    }

    // Update status and location
    shipment.status = statusUpdate.status
    shipment.currentLocation = statusUpdate.location
    shipment.lastUpdate = new Date().toISOString()

    // Update delay reason if provided
    if (statusUpdate.delayReason) {
        shipment.delayReason = statusUpdate.delayReason
    }

    // Reassess risk after status update
    shipment.riskLevel = await assessRisk(shipment)

    // Save updated shipment
    const updatedShipment = await storageService.put(STORAGE_KEY, shipment)
    return updatedShipment
}

async function addDelayReason(shipmentId, delayData) {
    const shipment = await storageService.get(STORAGE_KEY, shipmentId)
    if (!shipment) {
        throw new Error('Shipment not found')
    }

    // Add or update delay reason
    shipment.delayReason = delayData.reason
    shipment.lastUpdate = new Date().toISOString()

    // Reassess risk after adding delay reason
    shipment.riskLevel = await assessRisk(shipment)

    // Save updated shipment
    const updatedShipment = await storageService.put(STORAGE_KEY, shipment)
    return updatedShipment
}

async function assessRisk(shipment) {
    try {
        // Use the risk assessment utility
        const isAtRisk = isShipmentAtRisk(shipment)
        
        if (isAtRisk) {
            // Get detailed assessment to determine if it's AtRisk or Delayed
            const assessment = getDetailedRiskAssessment(shipment)
            return assessment.riskLevel
        } else {
            return 'None'
        }
    } catch (error) {
        console.error('Error assessing risk:', error)
        return 'None' // Default to safe
    }
}

// Initialize with sample data if empty
async function initializeSampleData() {
    try {
        const shipments = await storageService.query(STORAGE_KEY)
        console.log('Current shipments in storage:', shipments.length)
        
        if (shipments.length === 0) {
            console.log('No shipments found, initializing sample data...')
            
            // Import sample data
            const sampleData = await import('../../data/sample-shipments.json')
            console.log('Sample data imported:', sampleData.default)
            
            for (const shipment of sampleData.default) {
                try {
                    // Assess risk for each sample shipment
                    shipment.riskLevel = await assessRisk(shipment)
                    await storageService.post(STORAGE_KEY, shipment)
                    console.log('Added sample shipment:', shipment.id)
                } catch (error) {
                    console.error('Failed to add sample shipment:', shipment.id, error)
                }
            }
            
            console.log('Sample data initialized successfully')
        } else {
            console.log('Shipments already exist in storage')
        }
    } catch (error) {
        console.error('Failed to initialize sample data:', error)
    }
}

// Auto-initialize sample data
initializeSampleData()

