import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import AddPropertyComponent from '../AddProperty/AddPropertyComponent';

export default function PropertiesComponent() {

    const location = useLocation();
    const navigate = useNavigate();
    const [localtiesList, setLocalitiesList] = useState([]);
    const [propertiesList, setPropertiesList] = useState([]);
    const [localityValue, setLocalityValue] = useState(0);

    useEffect(() => {
        const fetchProperties = async () => {
            getProperties();
        }
        fetchProperties();

        const fetchLocalities = async () => {
            getLocalities();
        }
        fetchLocalities();
    }, [location])

    async function getProperties() {
        await axios.get("http://127.0.0.1:5000/get_all_properties")
            .then((res) => {
                console.log(res.data);
                setPropertiesList(res.data.properties);
            })
            .catch((err) => console.log(err))
    }

    async function getLocalities() {
        await axios.get("http://127.0.0.1:5000/get_all_localities")
            .then((res) => {
                console.log(res.data);
                setLocalitiesList(res.data.localities);
            })
            .catch((err) => console.log(err))
    }

    async function getPropertiesFiltered() {
        if (localityValue === 0) {
            await axios.get("http://127.0.0.1:5000/get_all_properties")
                .then((res) => {
                    console.log(res.data);
                    setPropertiesList(res.data.properties);
                })
                .catch((err) => console.log(err))
        }
        else {
            await axios.get("http://127.0.0.1:5000/fetch_all_properties", {
                params: {
                    locality_id: localityValue
                }
            })
                .then((res) => {
                    console.log(res.data);
                    setPropertiesList(res.data.properties);
                })
                .catch((err) => console.log(err))
        }
    }

    async function handlePropertyDelete(property_id) {
        await axios.delete("http://127.0.0.1:5000/delete_property_record", {
            params: {
                property_id: property_id
            }
        })
        .then((res) => {
            console.log(res.data);
            if(res.data.isDeleted === true) navigate(`/properties`);
        })
        .catch((err) => console.log(err))
    }

    return (
        <div>
            <NavLink to={`/`}>Home</NavLink>
            <h2 style={{marginLeft: "200px"}}>Properties</h2>
            <AddPropertyComponent />

            <h3 style={{marginLeft: "20px"}}>Properties</h3>
            <div style={{marginLeft: "100px", marginBottom: "20px"}}>
                <label htmlFor="locality">Search By Locality: </label>
                <select value={localityValue} onChange={(e) => setLocalityValue(Number(e.target.value))} name="locality" id="locality">
                    <option key={0} value={0}>All</option>
                    {
                        localtiesList.map(locality => (
                            <option key={locality.locality_id} value={locality.locality_id}>{locality.locality_name}</option>
                        ))
                    }
                </select>
                <button onClick={(e) => {
                    e.preventDefault();
                    getPropertiesFiltered();
                }}>
                    Search
                </button>
            </div>

            {
                propertiesList.map(property => (
                    <div style={{marginLeft: "50px"}} key={property.property_id}>
                        <span>{property.property_name}</span>
                        <span style={{ padding: "0 30px" }}>{property.locality_name}</span>
                        <span style={{ padding: "0 30px" }}>{property.owner_name}</span>
                        <span style={{ padding: "0 30px" }}><NavLink to={`/properties/updateProperty/${property.property_id}`}>Update</NavLink></span>
                        <span>
                            <button onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePropertyDelete(Number(property.property_id));
                            }}>
                                Delete
                            </button>
                        </span>
                    </div>
                ))
            }
        </div>
    )
}
