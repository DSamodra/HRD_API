//configure webserver
const express = require("express");
const { ObjectId } = require("mongodb");
const app = express();
let port = process.env.PORT || 3000;

// connect to server mongo db
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://samodra:samodra@cluster0.jdrme.mongodb.net/HRD_DB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }
});

//end point routing and server feature
app.listen(port, () => {
    console.log('connected to api server, welcome');
});

app.get("/", (req, res) => {
    var path = require('path');
    res.sendFile(path.join(__dirname + '/guide/index.html'));
    app.use(express.static(__dirname + '/guide/asset'));
    console.log("Root page");
});

//end point api get all data
app.get("/employee", (req, res) => {
    client.db("HRD_DB").collection('pegawai').find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        } else {
            console.log("Get All data success");
            res.send(result);
        }
    });
});

//get data by name
app.get("/employee/name", (req, res) => {
    //get name value
    var get_name = req.query.name;

    //transfer query to database
    client.db("HRD_DB").collection('pegawai').find({ name: get_name }).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        } else {
            console.log("Get single data");
            if (result[0] == null) {
                console.log("name not found on database");
                res.status(404).send("404 Name Not found");
            } else {
                console.log("name found");
                res.send(result);
            }
        }
    });
});


//get data by departement
app.get("/employee/departement", (req, res) => {
    //get name value
    var get_departement = req.query.departement;

    //transfer query to database
    client.db("HRD_DB").collection('pegawai').find({ departement : get_departement }).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        } else {
            console.log("Get single data");
            if (result[0] == null) {
                console.log("departement not found on database");
                res.status(404).send("404 departement Not found");
            } else {
                console.log("departement found");
                res.send(result);
            }
        }
    });
});

//end point api insert data
app.post("/employee/insert", (req, res) => {
    //get value
    var get_name = req.query.name;
    var get_sex = req.query.sex;
    var get_departement = req.query.departement;
    var get_status = req.query.status;
    var get_start = req.query.start;
    var get_phone = parseInt(req.query.phone);
    var get_birth = req.query.birth;
    var get_place = req.query.place;
    var get_religion = req.query.religion;
    var get_address = req.query.address;
    var get_education = req.query.education;
    var get_payment = parseInt(req.query.payment);

    //check duplicate id pegawai
    client.db('HRD_DB').collection('pegawai').find().sort({ _id: -1 }).limit(1).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        } else {
            const data_check = result[0];
            var last_id = parseInt(data_check.nip);
            last_id += 1;

            //add data to mongo gb
            client.db('HRD_DB').collection('pegawai').insertOne({
                nip: last_id,
                name: get_name,
                sex: get_sex,
                departement: get_departement,
                status: get_status,
                startWork: get_start,
                phoneNumber: get_phone,
                personal: {
                    birthDate: get_birth,
                    placeBirth: get_place,
                    religion: get_religion
                },
                address: get_address,
                education: get_education,
                payment: get_payment
            })
                .then(function (result) {
                    console.log("insert new data success");
                    return res.status(201).send("201 : Input Success");
                });
        }
    });
});

//end point update data 
app.post("/employee/update", (req, res) => {
    //get data
    var get_nip = parseInt(req.query.nip);
    var get_name = req.query.name;
    var get_sex = req.query.sex;
    var get_departement = req.query.departement;
    var get_status = req.query.status;
    var get_start = req.query.start;
    var get_phone = parseInt(req.query.phone);
    var get_birth = req.query.birth;
    var get_place = req.query.place;
    var get_religion = req.query.religion;
    var get_address = req.query.address;
    var get_education = req.query.education;
    var get_payment = parseInt(req.query.payment);

    //update data to database
    client.db('HRD_DB').collection('pegawai').updateOne(
        { nip: get_nip },
        {
            $set: {
                name: get_name,
                sex: get_sex,
                departement: get_departement,
                status: get_status,
                startWork: get_start,
                phoneNumber: get_phone,
                personal: {
                    birthDate: get_birth,
                    placeBirth: get_place,
                    religion: get_religion
                },
                address: get_address,
                education: get_education,
                payment: get_payment
            }
        })
        .then(function (result) {
            console.log("Update data success");
            res.status(200).send("200 : Update Data Success");
        });
});

//end point delete data
app.put("/employee/delete", (req, res) => {
    //get data
    var get_nip = parseInt(req.query.nip);;

    //delete data in mongo db
    client.db('HRD_DB').collection('pegawai').deleteOne({
        nip: get_nip
    })
        .then(function (result) {
            console.log("Delete data success");
            return res.status(200).send("200 : Delete Data Success");
        });
});


//end point show absent
app.get("/absen", (req, res) => {
    client.db("HRD_DB").collection('absen').find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        } else {
            console.log("Get absent data success");
            res.send(result);
        }
    });
});


//end point api insert absen
app.post("/absen", (req, res) => {
    //get value
    var nip = parseInt(req.query.nip);

    var today = new Date();

    //time
    var h = today.getHours(); 
    var m = today.getMinutes(); 
    var s = today.getSeconds(); 
    if (h < 10) {
        d = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    //date
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = mm+'-'+dd+'-'+yyyy + 'T' + h + ':' +m+ ':' +s;

    client.db('HRD_DB').collection('absen').insertOne({
        nip: nip,
        absent : today
    })
        .then(function (result) {
            console.log("insert absent success");
            return res.status(201).send("201 : Input Success");
        });
});