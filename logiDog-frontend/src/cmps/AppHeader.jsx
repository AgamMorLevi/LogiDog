import { NavLink } from 'react-router-dom'

export function AppHeader() {

  return (
    <header className="app-header main-container full">
      <nav className="nav-bar">

        <NavLink to="/dashboard" className="logo">
          LogiDog 
        </NavLink>

        <form className="search-form">
          <input type="text" name="search" placeholder="Search" />
          <button type="submit">Search</button>
        </form>

        <select className="filter-select" defaultValue="">
            <option value="">All Shipments</option>
            <option value="new">New</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="atRisk">At Risk</option>
            <option value="delayed">Delayed</option>
        
        </select>
      </nav>
    </header>
  )
}