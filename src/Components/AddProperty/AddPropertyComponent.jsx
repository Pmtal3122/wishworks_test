import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddPropertyComponent() {

    const location = useLocation();
    const navigate = useNavigate();
    const [localtiesList, setLocalitiesList] = useState([]);
    const [propertyName, setPropertyName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [localityValue, setLocalityValue] = useState(0);

    useEffect(() => {
        const fetchLocalities = async () => {
            getLocalities();
        }
        fetchLocalities();
    }, [location])

    // useEffect(() => {
    //     console.log(localityValue);
    //     console.log(typeof(localityValue));
    // }, [localityValue])

    useEffect(() => {
        if(localtiesList.length > 0)
        setLocalityValue(localtiesList[0].locality_id);
    }, [localtiesList])

    async function getLocalities() {
        await axios.get("http://127.0.0.1:5000/get_all_localities")
            .then((res) => {
                console.log(res.data);
                setLocalitiesList(res.data.localities);
            })
            .catch((err) => console.log(err))
    }

    async function handleFormSubmit() {
        await axios.post("http://127.0.0.1:5000/add_new_property", {propertyName, localityValue, ownerName})
        .then((res) => {
            console.log(res.data);
            if(res.data.isInserted === true) {
                setLocalityValue(0);
                setPropertyName("");
                setOwnerName("");
                navigate("/properties");
            }
        })
        .catch((err) => console.log(err))
    }

    return (
        <div>
            <h3 style={{marginLeft: "20px"}}>Add Property</h3>
            <form style={{margin: "25px 40px 100px 40px"}} onSubmit={(e) => {
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
                <input type="submit" value="Add Property" />
            </form>
        </div>
    )
}
