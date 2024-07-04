import React from 'react'
import { NavLink } from 'react-router-dom'

export default function HomeComponent() {
  return (
    <div>
      <h2>Home</h2>
      {/* <div>
        <NavLink to={`/addProperty`}>Add Property</NavLink>
      </div> */}
      <div>
        <NavLink to={`/addLocality`}>Add Locality</NavLink>
      </div>
      <div>
        <NavLink to={`/properties`}>Properties</NavLink>
      </div>
    </div>
  )
}
