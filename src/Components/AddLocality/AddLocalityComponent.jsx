import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AddLocalityComponent() {

    const naviage = useNavigate();
    const [localityName, setLocalityName] = useState("");

    async function handleFormSubmit() {
        await axios.post("http://127.0.0.1:5000/add_new_locality", {localityName})
        .then((res) => {
            console.log(res.data);
            if(res.data.isInserted === true) naviage('/');
        })
        .catch((err) => console.log(err));
    }

  return (
    <div>
      <h3>Add Locality</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFormSubmit();
      }}>
        <div>
            <label htmlFor="localityName">Name</label>
            <input type="text" value={localityName} onChange={(e) => setLocalityName(e.target.value)} name="localityName" id="localityName" />
        </div>
        <input type="submit" value="Add Locality" />
      </form>
    </div>
  )
}
