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
        let projectsBySelf = await projectModel.find({ userId: findUserByHeader.userId })
        let lengthOf = projectsBySelf.length
        if (!lengthOf) {
            throw new Error(' You dont have any projects ')
        }
        else {
            let responsePayload = []
            projectsBySelf.forEach(projectsElement => {
                responsePayload.push({
                    projectId: projectsElement._id,
                    project_Name: projectsElement.title,
                    githubLink: projectsElement.githublink,
                    demoLink: projectsElement.demolink,
                    description: projectsElement.description,
                    descriptionByMedia: {
                        fileName: projectsElement.descriptionByMedia.fileName,
                        fileType: projectsElement.descriptionByMedia.fileType,
                        fileSize: projectsElement.descriptionByMedia.fileSize,
                        filePath: projectsElement.descriptionByMedia.filePath
                    }
                })
            })
            return res.status(StatusCodes.OK).send(messageFormatter.successFormat(responsePayload, 'selfTab', StatusCodes.OK, 'your all projects'))
        }
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'selfTab', StatusCodes.NOT_FOUND))
    }
}

exports.othersProject = async (req, res) => {
    try {
        let AllTheOthersProjects = []
        let verifyToken = await new jsonwebtoken.verify(req.headers.authtoken, "secret")
        let allProjects = await projectModel.find({})
        if (!allProjects) {
            throw new Error(' no projects here still now, let add yours')
        }
        else {
            allProjects.forEach(projects => {
                if (verifyToken.id != projects.userId) {
                    AllTheOthersProjects.push(projects)
                }
            })
            let responsePayload = []
            AllTheOthersProjects.forEach(element => {
                responsePayload.push({
                    projectId: element._id,
                    ProjectPostedBy: element.userId,
                    ProjectTitle: element.title,
                    ProjectGithubLink: element.githublink,
                    ProjectDemoLink: element.demolink,
                    projectDescription: element.description,
                    projectDescriptionByMedia: element.descriptionByMedia
                })
            })
            return res.status(StatusCodes.OK).send(messageFormatter.successFormat(responsePayload, 'othersProject', StatusCodes.OK, 'Now you can see all the Others projects'))
        }
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'othersProject', StatusCodes.BAD_REQUEST))
    }
}

exports.addProjects = async (req, res) => {
    try {
        let request = req.body
        let getUserIdFromToken = await jwtTokenModel.findOne({ id: req.headers.authtoken })
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
                    filePath: '/'+req.file.path,
                    fileType: req.file.mimetype,
                    fileSize: fileformatter(req.file.size, 2)
                }
            })
            await projectModel(dataPayload).save()
            let responsePayload = {
                ProjectPostedBy: dataPayload.userId,
                title: dataPayload.title,
                demolink: dataPayload.demolink,
                githublink: dataPayload.githublink,
                description: dataPayload.description,
                descriptionByMedia: {
                    fileName: dataPayload.descriptionByMedia.fileName,
                    fileType: dataPayload.descriptionByMedia.fileType,
                    filePath: dataPayload.descriptionByMedia.filePath
                }
            }
            return res.status(200).send(messageFormatter.successFormat(responsePayload, 'addProjects', StatusCodes.OK, "Project was added successfully"))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'addProjects', StatusCodes.BAD_REQUEST))
    }
}

exports.updateProjectDetails = async (req, res) => {
    try {
        let userIdFromProject = await projectModel.findOne({ _id: req.params.id })
        let userIdFromToken = await jwtTokenModel.findOne({ id: userIdFromProject.userId })
        if (!(JSON.stringify(userIdFromProject.userId) == JSON.stringify(userIdFromToken.userId))) {
            let errorMessage = 'Unauthorized access, you are not a authorized person to modifiy this project '
            return res.status(StatusCodes.UNAUTHORIZED).send(messageFormatter.errorMsgFormat(errorMessage, 'updateProject', StatusCodes.UNAUTHORIZED))
        }
        await projectModel.findOneAndUpdate({ _id: req.params.id }, req.body)
        let dataPayload = await projectModel.findOne({ _id: req.params.id })
        if (req.file) {
            //with mediaFiles changes response 
            let responsePayload = {
                title: dataPayload.title,
                demolink: dataPayload.demolink,
                githublink: dataPayload.githublink,
                description: dataPayload.description,
                descriptionByMedia: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    fileType: '/'+req.file.filepath,
                }
            }
            res.status(StatusCodes.OK).send(messageFormatter.successFormat(responsePayload, 'updateProjectDetails', StatusCodes.OK, 'Your changes are updated'))
        }
        else {
            //without media updation response
            let responsePayload = {
                title: dataPayload.title,
                demolink: dataPayload.demolink,
                githublink: dataPayload.githublink,
                description: dataPayload.description,
            }
            res.status(StatusCodes.OK).send(messageFormatter.successFormat(responsePayload, 'updateProjectDetails', StatusCodes.OK, 'Your changes are updated'))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'updateProject', StatusCodes.BAD_REQUEST))
    }
}

exports.deleteProject = async (req, res) => {
    try {
        let userIdFromProject = await projectModel.findOne({ _id: req.params.id })
        let userIdFromToken = await jwtTokenModel.findOne({ id: userIdFromProject.userId })
        if (!(JSON.stringify(userIdFromProject.userId) == JSON.stringify(userIdFromToken.userId))) {
            let errorMessage = 'Unauthorized access, you are not a authorized person to Delete this project '
            return res.status(StatusCodes.UNAUTHORIZED).send(messageFormatter.errorMsgFormat(errorMessage, 'updateProject', StatusCodes.UNAUTHORIZED))
        }
        await projectModel.deleteOne({ _id: req.params.id })
        res.status(StatusCodes.OK).send(messageFormatter.successFormat('project was deleted', 'deleteproject', StatusCodes.OK, 'project was deleted successfully'))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'deleteProject', StatusCodes.BAD_REQUEST))
    }
}