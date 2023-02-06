//Import the required module
require("dotenv").config()
const express = require("express")
const app = express()

const bcrypt = require("bcrypt")
const db = require('./DbServer.js')
const mysql = require("mysql")
const generateAccessToken = require("./generateAccessToken")

const port = process.env.PORT

app.listen(port, 
   ()=> console.log(`Server Started on port ${port}...`))

app.use(express.json())

//CREATE USER
   app.post("/createUser", async (request ,response) => {
    const userEmail = request.body.email;
    const hashedPassword = await bcrypt.hash(request.body.password,10);
    db.getConnection( async (err, connection)=> {

     const sqlSearch = "SELECT * FROM user WHERE email = ?"
     const search_query = mysql.format(sqlSearch,[userEmail])
     const sqlInsert = "INSERT INTO user VALUES (0,?,?)"
     const insert_query = mysql.format(sqlInsert,[userEmail, hashedPassword])
     // ? will be replaced by values
     // ?? will be replaced by string
     await connection.query (search_query, async (err, result) => {
      if (err) throw (err)
      console.log("------> Search Results")
      if (result.length != 0) {
         connection.release()
       console.log("------> User already exists")
       response.sendStatus(409) 
      } 
      else {
       await connection.query (insert_query, (err, result)=> {
       connection.release()
       if (err) throw (err)
       console.log ("--------> Created new User")
       console.log(result.insertId)
       response.sendStatus(201)
      })
     }
    }) //end of connection.query()
    }) //end of app.post()
   })


//LOGIN USER
app.post("/login", async (request ,response) => {
   const userEmail = request.body.email;
   const password = request.body.password
   db.getConnection ( async (err, connection)=> {
    if (err) throw (err)
    const sqlSearch = "Select * from user where email = ?"
    const search_query = mysql.format(sqlSearch,[userEmail])
    await connection.query (search_query, async (err, result) => {
     connection.release()
     
     if (err) throw (err)
     if (result.length == 0) {
      console.log("--------> User does not exist")
      response.sendStatus(404)
     } 
     else {
        const hashedPassword = result[0].password
        //get the hashedPassword from result
       if (await bcrypt.compare(password, hashedPassword)) {
         console.log("---------> Generating accessToken")
         const token = generateAccessToken({userEmail: userEmail})   
         console.log(token)
         response.json({accessToken: token})
       } 
       else {
       console.log("---------> Password Incorrect")
       response.send("Password incorrect!")
       } //end of bcrypt.compare()
     }//end of User exists i.e. results.length==0
    }) //end of connection.query()
   }) //end of db.connection()
   }) //end of app.post()