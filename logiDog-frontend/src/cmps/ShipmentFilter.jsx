import React from 'react'
import './ShipmentFilter.scss'

export function ShipmentFilter({ filters, onFilterChange }) {
    const handleFilterChange = (filterType, value) => {
        onFilterChange(filterType, value)
    }

    return (
        <div className="shipment-filter">
            <div className="filter-section">
                <h3>Status Filter</h3>
                <div className="filter-options">
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="all"
                            checked={filters.status === 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        />
                        <span className="filter-label">All Status</span>
                    </label>
                    
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="new"
                            checked={filters.status === 'new'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        />
                        <span className="filter-label">New</span>
                    </label>
                    
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="inProgress"
                            checked={filters.status === 'inProgress'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        />
                        <span className="filter-label">In Progress</span>
                    </label>
                    
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="completed"
                            checked={filters.status === 'completed'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        />
                        <span className="filter-label">Completed</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <h3>Risk & Delay Filter</h3>
                <div className="filter-options">
                    <label className="filter-option">
                        <input
                            type="checkbox"
                            checked={filters.showDelayed}
                            onChange={(e) => handleFilterChange('showDelayed', e.target.checked)}
                        />
                        <span className="filter-label">Show Delayed Only</span>
                    </label>
                    
                    <label className="filter-option">
                        <input
                            type="checkbox"
                            checked={filters.showAtRisk}
                            onChange={(e) => handleFilterChange('showAtRisk', e.target.checked)}
                        />
                        <span className="filter-label">Show At Risk Only</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <h3>Additional Filters</h3>
                <div className="filter-options">
                    <select
                        value={filters.type || 'all'}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="consumer goods">Consumer Goods</option>
                        <option value="light industry">Light Industry</option>
                        <option value="medical equipment">Medical Equipment</option>
                    </select>

                    <select
                        value={filters.priority || 'all'}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
