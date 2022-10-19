//"/organisations"
const express = require('express');
const app = express();
// for parsing the body in POST request
const bodyParser = require('body-parser');
const mysql = require('mysql');

const organisations =[{
    orgId: 1,
    orgName: "John Deere"
}];
let tableName = organisations[organisations.length - 1 ].orgName.replace(/\s+/g, '');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET the organisation's name from the frontend
app.get('/organisations', function(req, res){
    return res.json(organisations);    
});

//POST all the organisations in the main homepage (if required)
//add to the list
app.post('/organisations', function (req, res) {
    var organisations = req.body.organisations;
    organisations.push(organisations);
    return res.send('Organisations has been added successfully');
});

//Creating a table with name of organisation in the database "organisations"
// create a new connection to the database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "newpassword",
    database: "organisations"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    let createQuery = `CREATE TABLE ${tableName} (name VARCHAR(255), address VARCHAR(255))`;
    connection.query(createQuery, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });

module.exports = {tableName};
app.listen('3000', function(){
    console.log('Server listening on port 3000');
});