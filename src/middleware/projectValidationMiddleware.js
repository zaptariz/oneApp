const joiValidation = require('../helper/joiValidation')
const { StatusCodes } = require('http-status-codes')
const projectController = require('../controller/projectController')
const messageFormatter = require('../utils/messageFormatter')

exports.selfTab = (req, res) => {
    try {
        return projectController.selfTab(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'selfTab',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.allProjects = (req, res) => {
    try {
        return projectController.othersProject(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'allProjects',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.addProject = async (req, res) => {
    try {
        let { error } = await new joiValidation.addProject(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(messageFormatter.validationFormat(
                    error,
                    'addProject',
                    StatusCodes.BAD_REQUEST
                ))
        }
        return projectController.addProjects(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'addProject', StatusCodes.BAD_REQUEST
            ))
    }
}

exports.updateProject = (req, res) => {
    try {
        return projectController.updateProjectDetails(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'updateProject',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.deleteProject = (req, res) => {
    try {
        return projectController.deleteProject(req, res)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST)
            .send(messageFormatter.errorMsgFormat(
                error.message,
                'deleteProject',
                StatusCodes.BAD_REQUEST
            ))
    }
}