const express = require('express')
const cors = require('cors')
const dbConnection = require('./src/configuration/dbConnection')
const userRoutes = require('./src/routes/index')

//create a Express application
const application = express()
//Using Cors
application.use(cors())
//BodyParser From express.json()
application.use(express.json())
//Invoke the DB connection
dbConnection.dbConnection()

application.use('/api/v1',userRoutes)