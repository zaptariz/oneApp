const bcrypt = require('bcrypt')
const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../utils/messageFormatter')
const userModel = require('../models/userModel')
const { fileformatter } = require('../middleware/fileFormatter')


exports.signup = async (req, res) => {
    try {
        let request = req.body
        //check the user is exit or not 
        let checkUserIsExist = await new userModel.find({ emailId: request.emailId })

        if (!checkUserIsExist) {
            //encrypt the password 
            let encryptPassword = await new bcrypt.hash(request.password, 10)
            let dataPayload = new userModel({
                firstName: request.firstName,
                lastName: request.lastName,
                emailId: request.emailId,
                password: encryptPassword,
                profilePhoto: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    fileSize: fileformatter(req.file.size, 2)
                }
            })
            //insert the data in DB
            await userModel(dataPayload).save()
            // destruct data for response
            let responsePayload = {
                FirstName : dataPayload.firstName,
                LastName : dataPayload.lastName,
                EMailID : dataPayload.emailId
            }
            res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.successFormat(responsePayload, 'signup',StatusCodes.CREATED,'registration successfully completed'))
        }
        else throw new Error ('EmailId already registered, try with another email')
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
}