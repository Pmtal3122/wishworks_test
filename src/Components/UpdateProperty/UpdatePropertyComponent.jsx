import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

export default function UpdatePropertyComponent() {

    const location = useLocation();
    const navigate = useNavigate();

    const { propertyId } = useParams();
    const [localtiesList, setLocalitiesList] = useState([]);
    const [propertyName, setPropertyName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [localityValue, setLocalityValue] = useState(0);

    useEffect(() => {
        const fetchLocalities = async () => {
            getLocalities();
        }
        fetchLocalities();

        const fetchPropertyById = async () => {
            getPropertyById();
        }
        fetchPropertyById();
    }, [location])

    // useEffect(() => {
    //     if (localtiesList.length > 0)
    //         setLocalityValue(localtiesList[0].locality_id);
    // }, [localtiesList])

    async function getLocalities() {
        await axios.get("http://127.0.0.1:5000/get_all_localities")
            .then((res) => {
                console.log(res.data);
                setLocalitiesList(res.data.localities);
            })
            .catch((err) => console.log(err))
    }

    async function getPropertyById() {
        await axios.get("http://127.0.0.1:5000/get_property_by_id", {
            params: {
                property_id: propertyId
            }
        })
        .then((res) => {
            console.log(res.data);
            if(res.data.isFetched === false) return;
            setPropertyName(res.data.property.property_name);
            setOwnerName(res.data.property.owner_name);
            setLocalityValue(res.data.property.locality_id);
        })
    }

    async function handleFormSubmit() {
        await axios.put("http://127.0.0.1:5000/update_property_details", {propertyId, propertyName, localityValue, ownerName})
        .then((res) => {
            console.log(res.data);
            if(res.data.isUpdated === true) navigate(`/properties`);
        })
        .catch((err) => console.log(err))
    }

    return (
        <div>
            <h3 style={{ marginLeft: "20px" }}>Add Property</h3>
            <NavLink style={{marginLeft: "40px"}} to={`/properties`}>Return</NavLink>
            <form style={{ margin: "25px 40px 100px 40px" }} onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
            }}>
                <div>
                    <label htmlFor="propertyName">Property Name</label>
                    <input value={propertyName} onChange={(e) => setPropertyName(e.target.value)} type="text" name="propertyName" id="propertyName" />
                </div>
                <div>
                    <label htmlFor="locality">Locality</label>
                    <select value={localityValue} onChange={(e) => setLocalityValue(Number(e.target.value))} name="locality" id="locality">
                        {
                            localtiesList.map(locality => (
                                <option key={locality.locality_id} value={locality.locality_id}>{locality.locality_name}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label htmlFor="ownerName">Owner Name</label>
                    <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} type="text" name="ownerName" id="ownerName" />
                </div>
                <input type="submit" value="Update Property" />
            </form>
        </div>
    )
}
