const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const express = require('express')
const app = express()
const port = 5000

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'Piyush@2002',
    port: 5432,
    database: 'propertiesdb'
});

//Connect client
client.connect((err, resp) => {
    if (!err) {
        console.log("Connection to db successful");
    }
    else {
        console.log("Connection to db failed");
    }
})

app.post("/add_new_property", (req, res) => {
    const response = {isInserted: false};
    const {propertyName, localityValue, ownerName} = req.body;
    const query = `insert into properties (property_name, locality_id, owner_name) values ('${propertyName}', ${localityValue}, '${ownerName}')`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else {
            client.query(`select property_id from properties where property_name = '${propertyName}' and locality_id = ${localityValue} and owner_name = '${ownerName}'`, (err1, res1) => {
                if(err1) {
                    console.log(err1);
                    res.send(response);
                }
                else {
                    response.isInserted = true;
                    response.property_id = res1.rows[0];
                    res.send(response);
                }
            })
        }
    })
})

app.post("/add_new_locality", (req, res) => {
    const response = { isInserted: false };
    const localityName = req.body.localityName;
    const query = `insert into localities (locality_name) values ('${localityName}')`;
    client.query(query, (err0, res0) => {
        if (err0) {
            response.message = "Failed to insert locality";
            res.send(response);
        }
        else {
            client.query(`select * from localities where locality_name = '${localityName}'`, (err1, res1) => {
                if (err1) {
                    response.message = "Failed to insert locality";
                    res.send(response);
                }
                else {
                    response.isInserted = true;
                    response.message = "Successfully inserted locality";
                    response.insertedLocality = res1.rows;
                    res.send(response);
                }
            })
        }
    })
})

app.get("/get_all_localities", (req, res) => {
    const response = {isFetched: false};
    const query = `select * from localities`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else {
            response.localities = res0.rows;
            response.isFetched = true;
            res.send(response);
        }
    })
})

app.get("/get_all_properties", (req, res) => {
    const response = {isFetched: false};
    const query = `select properties.property_id as property_id, properties.property_name as property_name, localities.locality_name as locality_name, properties.owner_name as owner_name from properties inner join localities on properties.locality_id = localities.locality_id order by properties.property_name, properties.owner_name`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else {
            response.properties = res0.rows;
            response.isFetched = true;
            res.send(response);
        }
    })
})

app.get("/fetch_all_properties", (req, res) => {
    const response = {isFetched: false};
    const locality_id = req.query.locality_id;
    const query = `select properties.property_id as property_id, properties.property_name as property_name, localities.locality_name as locality_name, properties.owner_name as owner_name from properties inner join localities on properties.locality_id = localities.locality_id where properties.locality_id = ${locality_id} order by properties.property_name, properties.owner_name`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else {
            response.properties = res0.rows;
            response.isFetched = true;
            res.send(response);
        }
    })
})

app.delete("/delete_property_record", (req, res) => {
    const response = {isDeleted: false};
    const property_id = req.query.property_id;
    const query = `delete from properties where property_id = ${property_id}`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            response.message = "Failed to delete property record";
            res.send(response);
        }
        else {
            response.isDeleted = true;
            response.message = `Successfully Deleted property record of property_id: ${property_id}`;
            res.send(response);
        }
    })
})

app.get("/get_property_by_id", (req, res) => {
    const response = {isFetched: false};
    const property_id = req.query.property_id;
    const query = `select * from properties where property_id = ${property_id}`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else {
            response.isFetched = true;
            response.property = res0.rows[0];
            res.send(response);
        }
    })
})

app.put("/update_property_details", (req, res) => {
    const response = {isUpdated: false};
    const {propertyId, propertyName, localityValue, ownerName} = req.body;
    const query = `update properties set property_name = '${propertyName}', locality_id = ${localityValue}, owner_name = '${ownerName}' where property_id = ${propertyId}`;
    client.query(query, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else {
            response.isUpdated = true;
            response.message = `Updated record with property_name = '${propertyName}', locality_id = ${localityValue}, owner_name = '${ownerName}' where property_id = ${propertyId}`;
            res.send(response);
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))