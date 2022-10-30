
# Insurance data ingestion system

The tech stack for the project ingestion

* Node.js
* Express.js
* JavaScript
* MySQL

organisations array includes one sample organisation, tableName includes each organisation name formatted for a MySQL tablename.

Used `csvToJson = require('convert-csv-to-json')` to convert csv file to json data

Used `connection.query()` to form queries to access the MySQL database

To display all the organisations and all their data I iterate through the tableName array and display each tableName

Used `function paginatedResults` to Paginate the results
