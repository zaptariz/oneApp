const express = require('express')
const mongoose = require('mongoose')
const { config } = require('./config')
require('dotenv').config()

const application = express()

exports.dbConnection = () => {
    try {
        mongoose.connect(config.db + config.dbConnection + config.database, (error, response) => {
            console.log('DB Connected :', response.host + ':' + response.port)
            application.listen(config.port, () => {
                console.log('NodeServer Connected With :', config.port)
            })
        })
    } catch (error) {
        console.log("error message while Mongo connection", error.message)
    }
}