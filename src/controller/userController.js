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
                    filePath: '/' + req.file.path,
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
            return res.status(StatusCodes.CREATED).send(messageFormatter.successFormat(responsePayload, 'signup', StatusCodes.CREATED, 'registration successfully completed'))
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
                    emailId: checkEmailIsRegistered.emailId
                }
                let jwtToken = await jsonwebtoken.sign(tokenPayload, "secret")

                let responsePayload = {
                    userId: checkEmailIsRegistered.id,
                    tokenId: jwtToken
                }
                //If Token exists, Delete the previous one, and lets create a new one
                let checkTokenExists = await jwtTokenModel.findOne({ userId: checkEmailIsRegistered._id })
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
        let logout = await jwtTokenModel.deleteMany({ tokenId: req.headers.authtoken })
        if (logout.deletedCount > 0)
            return res.status(StatusCodes.OK).send(messageFormatter.successFormat('logged out successfully', 'signout', StatusCodes.OK, " Bubye "))
        else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(messageFormatter.successFormat('No user logged in this id', 'logout', StatusCodes.INTERNAL_SERVER_ERROR, " No Data Found "))
        }
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'signout', StatusCodes.BAD_REQUEST))
    }
}

exports.dashboard = async (req, res) => {
    try {
        let loggedUserDetails = jsonwebtoken.verify(req.headers.authtoken, 'secret')
        let getSignedUser = await userModel.findById({ _id: loggedUserDetails.id })
        if (!getSignedUser)
            throw new Error(' token Not Found')
        let responsePayload = {
            name: getSignedUser.firstName + " " + getSignedUser.lastName,
            EmailId: getSignedUser.emailId,
            profilePhoto: {
                fileUrl: getSignedUser.profilePhoto.filePath
            }
        }
        return res.status(StatusCodes.OK).send(messageFormatter.successFormat(responsePayload, 'dashboard', StatusCodes.OK, "Welcome "))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'dashboard', StatusCodes.BAD_REQUEST))
    }
}