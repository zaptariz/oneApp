const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../utils/messageFormatter')
const { projectModel } = require('../models/projectModel')
const { fileformatter } = require('../middleware/fileFormatter')
const jsonwebtoken = require('jsonwebtoken')
const { jwtTokenModel } = require('../models/jwtTokenModel')
const isGithubURL = require('is-github-url')
const validurl = require('valid-url')


exports.selfTab = async (req, res) => {
    try {
        let findUserByHeader = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        let getSignedUser = await projectModel.find({ userId: findUserByHeader.userId })
        if (getSignedUser) {
            throw new Error(' You dont have any projects ')
        }
        res.status(StatusCodes.OK).send(messageFormatter.successFormat(getSignedUser, 'selfTab', StatusCodes.OK, 'your all projects'))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.NOT_FOUND))
    }
}

exports.addProjects = async (req, res) => {
    try {
        let request = req.body
        // let getUserIdFromToken = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        // let checkUserIsSignedUser = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        // if(checkUserIsSignedUser.userId == checkUserIsSignedUser)
        console.log("asjddaskjdhasdasdkasdkjhasdd asdkashhdkjashd kdkhkjashd :",req)
        let checkURL = validurl.isUri(request.demolink)
        console.log( " checkURL : ",checkURL)
        let checkGitURL = isGithubURL(request.githublink)
        if (!checkURL)
            throw new Error('check the Demo URL ')
        if (!checkGitURL)
            throw new Error('check the github URL ')
        else {
            let dataPayload = new projectModel({
                title: request.title,
                demoLink: request.demolink,
                githubLink: request.githublink,
                description: request.description,
                descriptionByMedia: {
                    fileName: request.file.originalname,
                    fileType: request.file.mimetype,
                    fileSize: fileformatter(request.file.size, 2)
                }
            })
            res.status(200).send(messageFormatter.successFormat(dataPayload, 'addProjects', StatusCodes.OK, " user is a "))
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'addProjects', StatusCodes.BAD_REQUEST))
    }
}

exports.othersProject = async (req, res) => {
    try {
        let findUserByHeader = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        let getSignedUser = await projectModel.find({ userId: findUserByHeader.userId })
        if (getSignedUser) {
            throw new Error(' You dont have any projects, ')
        }
        res.status(StatusCodes.OK).send(messageFormatter.successFormat(getSignedUser, 'selfTab', StatusCodes.OK, 'your all projects'))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.BAD_REQUEST))
    }
}