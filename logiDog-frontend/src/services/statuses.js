/**
 * LogiDog Shipment Statuses
 * Defines all possible shipment statuses and their properties
 */

export const Statuses = {
    // Initial statuses
    WAITING_FOR_PICKUP: {
        value: 'WAITING_FOR_PICKUP',
        label: 'Waiting for Pickup',
        description: 'Shipment is ready for carrier pickup',
        color: '#ff9800',
        icon: '📦',
        isActive: true,
        canTransitionTo: ['PICKED_UP', 'CANCELLED']
    },

    PICKED_UP: {
        value: 'PICKED_UP',
        label: 'Picked Up',
        description: 'Carrier has picked up the shipment',
        color: '#9c27b0',
        icon: '🚚',
        isActive: true,
        canTransitionTo: ['AT_WAREHOUSE', 'HEADING_TO_PORT', 'IN_TRANSIT']
    },

    // Warehouse statuses
    AT_WAREHOUSE: {
        value: 'AT_WAREHOUSE',
        label: 'At Warehouse',
        description: 'Shipment is stored at warehouse',
        color: '#66bb6a',
        icon: '🏭',
        isActive: true,
        canTransitionTo: ['HEADING_TO_PORT', 'OUT_FOR_DELIVERY', 'PICKED_UP']
    },

    HEADING_TO_PORT: {
        value: 'HEADING_TO_PORT',
        label: 'Heading to Port',
        description: 'Shipment is en route to port',
        color: '#2196f3',
        icon: '🚢',
        isActive: true,
        canTransitionTo: ['IN_TRANSIT', 'AT_WAREHOUSE']
    },

    // Transit statuses
    IN_TRANSIT: {
        value: 'IN_TRANSIT',
        label: 'In Transit',
        description: 'Shipment is moving between locations',
        color: '#42a5f5',
        icon: '✈️',
        isActive: true,
        canTransitionTo: ['CUSTOMS', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED']
    },

    // Customs statuses
    CUSTOMS: {
        value: 'CUSTOMS',
        label: 'At Customs',
        description: 'Shipment is undergoing customs inspection',
        color: '#ffc107',
        icon: '🏛️',
        isActive: true,
        canTransitionTo: ['CUSTOMS_HOLD', 'RELEASED', 'IN_TRANSIT']
    },

    CUSTOMS_HOLD: {
        value: 'CUSTOMS_HOLD',
        label: 'Customs Hold',
        description: 'Shipment is held by customs',
        color: '#f44336',
        icon: '⛔',
        isActive: true,
        canTransitionTo: ['RELEASED', 'CUSTOMS']
    },

    RELEASED: {
        value: 'RELEASED',
        label: 'Released from Customs',
        description: 'Shipment cleared customs inspection',
        color: '#4caf50',
        icon: '✅',
        isActive: true,
        canTransitionTo: ['IN_TRANSIT', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY']
    },

    // Delivery statuses
    OUT_FOR_DELIVERY: {
        value: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        description: 'Shipment is out for final delivery',
        color: '#00bcd4',
        icon: '🚛',
        isActive: true,
        canTransitionTo: ['DELIVERED', 'DELIVERY_ATTEMPT_FAILED', 'AT_WAREHOUSE']
    },

    DELIVERED: {
        value: 'DELIVERED',
        label: 'Delivered',
        description: 'Shipment successfully delivered',
        color: '#4caf50',
        icon: '🎉',
        isActive: false,
        canTransitionTo: []
    },

    DELIVERY_ATTEMPT_FAILED: {
        value: 'DELIVERY_ATTEMPT_FAILED',
        label: 'Delivery Attempt Failed',
        description: 'Delivery attempt was unsuccessful',
        color: '#ff9800',
        icon: '❌',
        isActive: false,
        canTransitionTo: ['OUT_FOR_DELIVERY', 'AT_WAREHOUSE', 'RETURNED_TO_SENDER']
    },

    // Problem statuses
    RETURNED_TO_SENDER: {
        value: 'RETURNED_TO_SENDER',
        label: 'Returned to Sender',
        description: 'Shipment returned to sender',
        color: '#795548',
        icon: '↩️',
        isActive: false,
        canTransitionTo: []
    },

    CANCELLED: {
        value: 'CANCELLED',
        label: 'Cancelled',
        description: 'Shipment was cancelled',
        color: '#9e9e9e',
        icon: '🚫',
        isActive: false,
        canTransitionTo: []
    },

    LOST: {
        value: 'LOST',
        label: 'Lost',
        description: 'Shipment is lost',
        color: '#f44336',
        icon: '❓',
        isActive: false,
        canTransitionTo: ['FOUND', 'INVESTIGATION_COMPLETE']
    }
}

// Dashboard columns & statuses mapping
export const COLUMN_MAP = {
    new: [
        'WAITING_FOR_PICKUP',
        'PICKED_UP',
    ],
    inProgress: [
        'AT_WAREHOUSE',
        'HEADING_TO_PORT',
        'IN_TRANSIT',
        'CUSTOMS',
        'CUSTOMS_HOLD',
        'RELEASED',
        'OUT_FOR_DELIVERY',
    ],
    completed: [
        'DELIVERED',
        'DELIVERY_ATTEMPT_FAILED',
        'RETURNED_TO_SENDER',
        'CANCELLED',
        'LOST',
    ],
}

// SLA per status (hours)
export const STATUS_SLA_HOURS = {
    WAITING_FOR_PICKUP: 12,
    PICKED_UP: 2,
    AT_WAREHOUSE: 8,
    HEADING_TO_PORT: 4,
    IN_TRANSIT: 24,
    CUSTOMS: 1,
    CUSTOMS_HOLD: 1,
    RELEASED: 0,
    OUT_FOR_DELIVERY: 12,

    DELIVERED: 0,
    DELIVERY_ATTEMPT_FAILED: 0,
    RETURNED_TO_SENDER: 0,
    CANCELLED: 0,
    LOST: 0,
}

// SLA per shipment type (whole shipment)
export const SHIPMENT_SLA_HOURS_BY_TYPE = {
    'consumer goods': 120,   // 5d
    'light industry': 168,   // 7d
    'medical equipment': 48, // 2d
}

// Row color tokens (class names / CSS variables)
export const ROW_COLORS = {
    normal: 'row-normal',
    atRisk: 'row-warning',   // yellow background
    delayed: 'row-danger',   // red background
}

// Helper: threshold for "at risk" on a stage
export const AT_RISK_THRESHOLD = 0.8 // 80%

// Helper functions
export function getStatusInfo(status) {
    return Statuses[status] || {
        value: status,
        label: status.replace(/_/g, ' '),
        description: 'Unknown status',
        color: '#9e9e9e',
        icon: '❓',
        isActive: false,
        canTransitionTo: []
    }
}

export function getStatusColor(status) {
    return getStatusInfo(status).color
}

export function getStatusIcon(status) {
    return getStatusInfo(status).icon
}

export function getStatusLabel(status) {
    return getStatusInfo(status).label
}

export function canTransition(fromStatus, toStatus) {
    const statusInfo = getStatusInfo(fromStatus)
    return statusInfo.canTransitionTo.includes(toStatus)
}

export function getActiveStatuses() {
    return Object.values(Statuses).filter(status => status.isActive)
}

export function getProblemStatuses() {
    return [
        'CUSTOMS_HOLD',
        'DELIVERY_ATTEMPT_FAILED',
        'LOST',
        'RETURNED_TO_SENDER'
    ]
}

export function getTransitStatuses() {
    return [
        'PICKED_UP',
        'IN_TRANSIT',
        'HEADING_TO_PORT'
    ]
}

export function getWarehouseStatuses() {
    return [
        'AT_WAREHOUSE',
        'WAITING_FOR_PICKUP'
    ]
}

export function getDeliveryStatuses() {
    return [
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'DELIVERY_ATTEMPT_FAILED'
    ]
}

// Dashboard column helpers
export function getColumnForStatus(status) {
    if (COLUMN_MAP.new.includes(status)) return 'new'
    if (COLUMN_MAP.inProgress.includes(status)) return 'inProgress'
    if (COLUMN_MAP.completed.includes(status)) return 'completed'
    return 'inProgress' // default fallback
}

export function isNewStatus(status) {
    return COLUMN_MAP.new.includes(status)
}

export function isInProgressStatus(status) {
    return COLUMN_MAP.inProgress.includes(status)
}

export function isCompletedStatus(status) {
    return COLUMN_MAP.completed.includes(status)
}

// Status progression order for risk assessment
export const STATUS_PROGRESSION = {
    'WAITING_FOR_PICKUP': 1,
    'PICKED_UP': 2,
    'AT_WAREHOUSE': 3,
    'HEADING_TO_PORT': 4,
    'IN_TRANSIT': 5,
    'CUSTOMS': 6,
    'CUSTOMS_HOLD': 6,
    'RELEASED': 7,
    'OUT_FOR_DELIVERY': 8,
    'DELIVERED': 9,
    'DELIVERY_ATTEMPT_FAILED': 8,
    'RETURNED_TO_SENDER': 10,
    'CANCELLED': 11,
    'LOST': 12
}

// Export default
export default Statuses


