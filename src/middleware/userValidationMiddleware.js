const joiValidation = require('../helper/joiValidation')
const { StatusCodes } = require('http-status-codes')
const userController = require('../controller/userController')
const messageFormatter = require('../utils/messageFormatter')

exports.signup = async (req, res) => {
    try {
        let { error } = await joiValidation.signup(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'signup',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return userController.signup(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'signup',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.signin = async (req, res) => {
    try {
        let { error } = await joiValidation.signin(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'signin',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return userController.signin(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'signin',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.signOut = (req, res) => {
    try {
        return userController.signout(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'signout',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.dashboard = (req, res) => {
    try {
        return userController.dashboard(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'signout',
                StatusCodes.BAD_REQUEST
            ))
    }
}