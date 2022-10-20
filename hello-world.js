//"/organisations"
const express = require('express');
const app = express();
// for parsing the body in POST request
const bodyParser = require('body-parser');
const mysql = require("mysql");


const organisations =[{
    orgId: 1,
    orgName: "Apple"
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
    })
    
  let createQuery = `CREATE TABLE ${tableName} (EmployeeID VARCHAR(255), FirstName VARCHAR(255), MiddleName VARCHAR(255), LastName VARCHAR(255), Email VARCHAR(255),DateOfBirth VARCHAR(255),Gender VARCHAR(255))`;
  connection.query(createQuery, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  let csvToJson = require('convert-csv-to-json');
  let json = csvToJson.fieldDelimiter(',').getJsonFromCsv("sample.csv");
  console.log(json);

  let insertQuery = "INSERT INTO ?? (EmployeeID,FirstName,MiddleName,LastName,Email,DateOfBirth,Gender) VALUES (?,?,?,?,?,?,?)";
  for (let i = 0; i < json.length; i++) {
   connection.query(insertQuery, [tableName,json[i].EmployeeID,
                                            json[i].FirstName,
                                            json[i].MiddleName,
                                            json[i].LastName,
                                            json[i].Email,
                                            json[i].DateOfBirth,
                                            json[i].Gender], (error, response) => {
          console.log(error || response);
        });
    }

    let showTablesQuery = "SHOW TABLES;"
    connection.query(showTablesQuery,(error,response) => {
      if(error) {
        throw error;
    } else {
      setValue(response);
    }
    });

   let tables = [];
   let tableNamesList = [];
    
   function setValue(value) {
    tables = eval(value);
    for(let i = 0; i < tables.length; i++){
    tableNamesList.push(tables[i].Tables_in_organisations);
    }
    let tableContent = [];
    let finalResult =[];

      //go through database to find tables for each organisation and display them
     for(let i = 0; i < tableNamesList.length; i++){
      console.log(tableNamesList[i]);
      let selectQuery = "SELECT * FROM ??";
      connection.query(selectQuery,tableNamesList[i], (error, response) => {
        console.log(error || tableContent.push(response));
        finalResult.push({
          name:tableNamesList[i],
          content:tableContent[i],
        })
        console.log(finalResult[i]);
      })
     }
    }

    
    


// get paginated results
app.get("/json/paginate", paginatedResults(json), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(json) {
  // middleware function
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
 
    // calculating the starting and ending index
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
 
    const results = {};
    if (endIndex < json.length) {
      results.next = {
        page: page + 1,
        size: size
      };
    }
 
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        size: size
      };
    }
 
    results.results = json.slice(startIndex, endIndex);
 
    res.paginatedResults = results;
    next();
  };
}


app.listen('3000', function(){
    console.log('Server listening on port 3000');
});