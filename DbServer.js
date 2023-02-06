//using "dotenv" for importing db credential from out .evn file
require("dotenv").config()
const mysql = require("mysql")

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
   connectionLimit: 100,
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   database: DB_DATABASE,
   port: DB_PORT
})


db.getConnection( (err, connection)=> {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)
 var sql = "CREATE TABLE if not exists user (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), password VARCHAR(255))";
 connection.query(sql, function (err, row) {
    if (err) throw err;
    console.log("Table created");
  });
});

module.exports = db