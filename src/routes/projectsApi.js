const express = require('express')
const multer = require('multer')
const joiValidation = require('../helper/joiValidation')
const fileUploader = require('../middleware/fileUploader')
const { StatusCodes } = require('http-status-codes')
const projectController = require('../controller/projectController')
const messageFormatter = require('../utils/messageFormatter')
const router = express.Router()
const adminAuthenticator = require('../middleware/adminAuthentication')

router.get('/selfTab',(req, res) => {
    try {
        console.log( "req :", req.body)
        return projectController.selfTab(req,res)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.BAD_REQUEST))
    }
})

router.post('/addproject',adminAuthenticator,(req, res) => {
    try {
        console.log(req.body)
        let {error} = joiValidation.addProject(req.body)
        if(error) {
            return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.validationFormat(error, 'addProjectJoiValidation', StatusCodes.BAD_REQUEST))
        }
        return projectController.addProjects(req,res)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.BAD_REQUEST))
    }
})



module.exports = router