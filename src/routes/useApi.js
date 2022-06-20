const express = require('express')
const multer = require('multer')
const joiValidation = require('../helper/joiValidation')
const fileUploader = require('../middleware/fileUploader')
const { StatusCodes } = require('http-status-codes')
const userController = require('../controller/userController')
const messageFormatter = require('../utils/messageFormatter')
const router = express.Router()

const upload = multer({ storage: fileUploader.fileStorage, fileFilter: fileUploader.fileFilter })

router.post('/signup', upload.single('profilephoto'), (req, res) => {
    try {
        let { error } = joiValidation.signupSchema(req.body)
        if(error){
            return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.validationFormat(error, 'register', StatusCodes.BAD_REQUEST))
        }
        return userController.signup(req,res)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
})

router.post('/signin', (req, res) => {
    try {
        let { error } = joiValidation.signinSchema(req.body)
        if(error){
            return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.validationFormat(error, 'register', StatusCodes.BAD_REQUEST))
        }
        return userController.signin(req,res)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
})

module.exports = router