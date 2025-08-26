
// זה מה שהמתעפל יראה אם יש משלוח בעיכוב/סיכון 

export const Statuses = [
  'WAITING_FOR_PICKUP',   // ממתין לאיסוף
  'PICKED_UP',            // נאסף
  'AT_WAREHOUSE',         // במרלו"ג
  'HEADING_TO_PORT',      // בדרך לנמל/שדה
  'IN_TRANSIT',           // בדרך (ים/אוויר)
  'CUSTOMS',              // במכס
  'CUSTOMS_HOLD',         // עיכוב במכס
  'RELEASED',             // שוחרר ממכס
  'OUT_FOR_DELIVERY',     // בשליחות
  'DELIVERED',            // נמסר
  'DELIVERY_ATTEMPT_FAILED', // ניסיון מסירה נכשל
  'RETURNED_TO_SENDER',   // הוחזר לשולח
  'CANCELLED',            // בוטל
  'LOST'                  // חבילה אבדה
]

    const FilterOptions = [
  { value: 'new', label: 'New Orders' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'all', label: 'All Shipments' },
  { value: 'completed', label: 'Completed' },
  { value: 'atRisk', label: 'At Risk' },
  { value: 'delayed', label: 'Delayed' }
]


