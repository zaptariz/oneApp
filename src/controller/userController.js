const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const messageFormatter = require('../utils/messageFormatter')
const { StatusCodes } = require('http-status-codes')
const { userModel } = require('../models/userModel')
const { fileformatter } = require('../middleware/fileFormatter')
const { jwtTokenModel } = require('../models/jwtTokenModel')
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
            return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.successFormat(responsePayload, 'signup', StatusCodes.CREATED, 'registration successfully completed'))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signup', StatusCodes.BAD_REQUEST))
    }
}

exports.signin = async (req, res) => {
    try {
        let request = req.body
        let checkEmailIsRegistered = await userModel.findOne({ emailId: request.emailId })
        if (checkEmailIsRegistered) {
            //Decrypt the password 
            let Decrypt = await new bcrypt.compare(request.password, checkEmailIsRegistered.password)
            if (Decrypt) {
                let tokenPayload = {
                    id: checkEmailIsRegistered.id,
                    tokenId: checkEmailIsRegistered.emailId
                }
                let jwtToken = jsonwebtoken.sign(tokenPayload, "secret")

                let responsePayload = {
                    userId: checkEmailIsRegistered.id,
                    tokenId: jwtToken
                }
                //If Token exists, Delete the previous one, and lets create a new one
                let checkTokenExists = await jwtTokenModel.findOne({ userId: checkEmailIsRegistered.id })
                if (checkTokenExists)
                    await jwtTokenModel.findOneAndUpdate({ userId: checkEmailIsRegistered.id, tokenId: responsePayload.tokenId })
                else
                    await jwtTokenModel(responsePayload).save()
                return res.status(StatusCodes.OK).send(messageFormatter.successFormat(
                    responsePayload,
                    'login',
                    StatusCodes.OK,
                    `logged in successfully, Welcome ${checkEmailIsRegistered.firstName} ${checkEmailIsRegistered.lastName}`))
            }
            else throw new Error('credential not matched')
        }
        else throw new Error('Emailid not registered with records, signup first')
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signin', StatusCodes.BAD_REQUEST))
    }
}

exports.signout = async (req, res) => {
    try {
        //Delete the  Jwt token for log out
        await jwtTokenModel.deleteMany({ token: req.headers.authorization })
        return res.status(StatusCodes.OK).send(messageFormatter.successFormat('', 'logout', StatusCodes.OK, " logged out successfully "))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'login', StatusCodes.BAD_REQUEST))
    }
}

exports.dashboard = async (req, res) => {
    try {
        let findUserByHeader = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        let getSignedUser = await userModel.findOne({ userId: findUserByHeader.userId })
        let responsePayload = {
            name: getSignedUser.firstName + " " + getSignedUser.lastName,
            EmailId: getSignedUser.emailId,
            profilePhoto: getSignedUser.profilePhoto
        }
        return res.status(StatusCodes.OK).send(messageFormatter.successFormat(responsePayload, 'dashboard', StatusCodes.OK, "Welcome "))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'dashboard', StatusCodes.BAD_REQUEST))
    }
}