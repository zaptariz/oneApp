const express = require('express')
const cors = require('cors')
const dbConnection = require('./src/configuration/dbConnection')

//create a Express application
const application = express()
//Using Cors
application.use(cors())
//BodyParser From express.json()
application.use(express.json())
//Invoke the DB connection
dbConnection.dbConnection()