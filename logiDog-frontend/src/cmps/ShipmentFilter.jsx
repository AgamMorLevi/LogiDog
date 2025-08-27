import React from 'react'

export function ShipmentFilter({ filters, onFilterChange }) {
    function handleFilterChange (filterType, value) {
        onFilterChange(filterType, value)
    }

    return (
        <div className="shipment-filter">filter </div>

    )

}
