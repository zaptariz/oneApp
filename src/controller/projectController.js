const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../utils/messageFormatter')
const { projectModel } = require('../models/projectModel')
const { fileformatter } = require('../middleware/fileFormatter')
const jsonwebtoken = require('jsonwebtoken')
const { jwtTokenModel } = require('../models/jwtTokenModel')


exports.selfTab = async (req, res) => {
    try {
        let findUserByHeader = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        let getSignedUser = await projectModel.find({ userId: findUserByHeader.userId })
        if (getSignedUser) {
            throw new Error(' You dont have any projects, l ')
        }
        res.status(StatusCodes.OK).send(messageFormatter.successFormat(getSignedUser, 'selfTab', StatusCodes.OK, 'your all projects'))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.BAD_REQUEST))
    }
}

exports.othersProject = async (req, res) => {
    try {
        let findUserByHeader = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        let getSignedUser = await projectModel.find({ userId: findUserByHeader.userId })
        if (getSignedUser) {
            throw new Error(' You dont have any projects, l ')
        }
        res.status(StatusCodes.OK).send(messageFormatter.successFormat(getSignedUser, 'selfTab', StatusCodes.OK, 'your all projects'))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.BAD_REQUEST))
    }
}