import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeComponent from '../Components/Home/HomeComponent';
import AddLocalityComponent from '../Components/AddLocality/AddLocalityComponent';
// import AddPropertyComponent from '../Components/AddProperty/AddPropertyComponent';
import PropertiesComponent from '../Components/Properties/PropertiesComponent';
import UpdatePropertyComponent from '../Components/UpdateProperty/UpdatePropertyComponent';

export default function PropertiesRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeComponent />} />
        <Route path='/addLocality' element={<AddLocalityComponent />} />
        {/* <Route path='/addProperty' element={<AddPropertyComponent />} /> */}
        <Route path='/properties' element={<PropertiesComponent />} />
        <Route path='/properties/updateProperty/:propertyId' element={<UpdatePropertyComponent />} />
      </Routes>
    </Router>
  )
}
