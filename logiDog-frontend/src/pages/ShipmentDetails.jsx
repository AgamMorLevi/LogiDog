import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadCar, addCarMsg } from '../store/car.actions'


export function ShipmentDetails() {

  
    return (
        <section className="Shipment-details">
            <Link to="/shipments">Back to list</Link>
            <h1>Shipment Details</h1>

        </section>
    )
}