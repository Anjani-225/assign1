const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
const {tableName} = require('./hello-world');
let stream = fs.createReadStream("sample.csv");
let csvData = [];
let csvStream = fastcsv

  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "newpassword",
      database: "organisations"
    });

    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        let query =
          "INSERT INTO ?? (id, name, description, created_at) VALUES ?";
        connection.query(query, [tableName,csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });

stream.pipe(csvStream);