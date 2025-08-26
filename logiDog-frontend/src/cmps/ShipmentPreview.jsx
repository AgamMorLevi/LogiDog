import { Link } from 'react-router-dom'

export function ShipmentPreview({ car }) {
    return (
        <article className="preview">
            <header>
                <Link to={`/Shipment/${Shipment._id}`}></Link>
            </header>
        </article>
    )
}