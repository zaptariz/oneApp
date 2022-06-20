const bcrypt = require('bcrypt')
const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../utils/messageFormatter')
const { userModel } = require('../models/userModel')
const { fileformatter } = require('../middleware/fileFormatter')


exports.signup = async (req, res) => {
    try {
        let request = req.body
        //check the user is exit or not 
        let checkUserIsExist = await userModel.findOne({ emailId: request.emailId })
        if (checkUserIsExist) {
            if (checkUserIsExist.emailId == request.emailId) {
                throw new Error('EmailId already registered, try with another email')
            }
        }
        else {
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
                FirstName: dataPayload.firstName,
                LastName: dataPayload.lastName,
                EMailID: dataPayload.emailId
            }
            res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.successFormat(responsePayload, 'signup', StatusCodes.CREATED, 'registration successfully completed'))
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
}