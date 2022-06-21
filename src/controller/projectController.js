const { StatusCodes } = require('http-status-codes')
const messageFormatter = require('../utils/messageFormatter')
const { projectModel } = require('../models/projectModel')
const { fileformatter } = require('../middleware/fileFormatter')
const jsonwebtoken = require('jsonwebtoken')
const { jwtTokenModel } = require('../models/jwtTokenModel')
const isGithubURL = require('is-github-url')
const validurl = require('valid-url')
const { userModel } = require('../models/userModel')


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
        let getUserIdFromToken = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        // let checkUserIsSignedUser = await jwtTokenModel.findOne({ id: req.headers.authtoken })
        // if(checkUserIsSignedUser.userId == checkUserIsSignedUser)
        if (!validurl.isUri(request.demolink))
            throw new Error('check the Demo URL ')
        if (!isGithubURL(request.githublink))
            throw new Error('check the github URL ')
        else {
            let dataPayload = new projectModel({
                userId: getUserIdFromToken.userId,
                title: request.title,
                demolink: request.demolink,
                githublink: request.githublink,
                description: request.description,
                descriptionByMedia: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    fileSize: fileformatter(req.file.size, 2)
                }
            })
            await projectModel(dataPayload).save()
            let responsePayload = {
                title: dataPayload.title,
                demolink: dataPayload.demolink,
                githublink: dataPayload.githublink,
                description: dataPayload.description,
                descriptionByMedia: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                }
            }
            res.status(200).send(messageFormatter.successFormat(responsePayload, 'addProjects', StatusCodes.OK, "Project was added successfully"))
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'addProjects', StatusCodes.BAD_REQUEST))
    }
}

exports.othersProject = async (req, res) => {
    try {
        let AllTheOthersProjects = []
        let verifyToken = await jsonwebtoken.verify(req.headers.authtoken, "secret")
        let allProjects = await projectModel.find({})
        console.log('allProjects : ', allProjects)
        if (!allProjects) {
            throw new Error(' now project here still now ')
        }
        else {
            allProjects.forEach(projects => {
                if (verifyToken.id != projects.userId)
                    AllTheOthersProjects.push(projects)
            });
            res.status(StatusCodes.OK).send(messageFormatter.successFormat(AllTheOthersProjects, 'othersProject', StatusCodes.OK, 'All Others projects'))
        }
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'othersProject', StatusCodes.BAD_REQUEST))
    }
}