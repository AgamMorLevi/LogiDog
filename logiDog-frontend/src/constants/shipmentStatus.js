export function calculateShipmentRiskLevel(shipment) {

  const STATUS_SLA_HOURS = {
    WAITING_FOR_PICKUP: 12,
    PICKED_UP: 2,
    AT_WAREHOUSE: 8,
    HEADING_TO_PORT: 4,
    IN_TRANSIT: 24,
    CUSTOMS: 1,
    CUSTOMS_HOLD: 1,    
    OUT_FOR_DELIVERY: 12,
    DELIVERED: 0,
    DELIVERY_ATTEMPT_FAILED: 0,
    RETURNED_TO_SENDER: 0,
    CANCELLED: 0,
    LOST: 0
  };

  const SHIPMENT_SLA_HOURS_BY_TYPE = {
    'consumer goods': 120,   // 5 
    'light industry': 168,   // 7 
    'medical equipment': 48  // 2 
  };

  const HOUR = 36e5

  function hoursSince(dateISO) {
    return (Date.now() - new Date(dateISO).getTime()) / HOUR;
  }


  const statusSla   = STATUS_SLA_HOURS[shipment.status] ?? 0
  const shipmentSla = SHIPMENT_SLA_HOURS_BY_TYPE[shipment.type] ?? 120

  const statusElapsed = hoursSince(shipment.statusUpdatedAt ?? shipment.lastUpdate)
  const totalElapsed  = hoursSince(shipment.createdDate)


  const isAtRisk =
    shipment.status === 'CUSTOMS_HOLD' ||
    (statusSla > 0 && statusElapsed >= 0.8 * statusSla)


  const isDelayed =
    totalElapsed > shipmentSla ||
    (statusSla > 0 && statusElapsed > statusSla) ||
    (shipment.status === 'WAITING_FOR_PICKUP' &&
     totalElapsed > STATUS_SLA_HOURS.WAITING_FOR_PICKUP)

  if (isDelayed) return 'Delayed'
  if (isAtRisk)  return 'AtRisk'

}