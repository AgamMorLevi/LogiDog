
export function ShipmentsList({ Shipments }) {

    return <section>
        <ul className="Shipments-list">
            {Shipments.map(Shipment =>
                <li key={Shipment._id}></li>)
            }
        </ul>
    </section>
}