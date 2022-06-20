const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { config } = require('./src/configuration/config')
// const dbConnection = require('./src/configuration/dbConfig')
require('dotenv').config()
const application = express()
application.use(express.json())
application.use(cors())
const router = require('./src/routes/index')
const db = () => {
    try {
        mongoose.connect(config.db+config.dbConnection + config.database, (error, response) => {
            console.log(" db connected with : " + response.host + ':' + response.port)
            application.listen(config.port)
            console.log(` Node Server started...\n Server Running on PORT : ${config.port} `)
        })
    } catch (error) { console.log(error.message) }
}
//invoke the DB
// dbConnection.db()
db();

application.use('/api/v1', (req, res, next) => {
    next()
}, router);