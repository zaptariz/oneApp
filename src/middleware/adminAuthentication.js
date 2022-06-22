const jwt = require('jsonwebtoken');
const { jwtTokenModel } = require('../models/jwtTokenModel');
const { StatusCodes } = require('http-status-codes');
const messageFormatter = require('../utils/messageFormatter')


/*********************************
 * JsonWebToken For adminAuthenticaton.
 *
 * @param {string}      tokenFromRequestHeader
 * @param {object}      id
 * @param {string}      userEmail
 * 
 * @returns {function}
 * 
 *********************************/
const adminAuthenticator = async (req, res, next) => {
    try {
        let tokenFromRequestHeader = req.headers.authtoken
        let verifyToken = await new jwt.verify(tokenFromRequestHeader, "secret")
        let checkToken = await jwtTokenModel.findOne({ tokenId: tokenFromRequestHeader, userId: verifyToken.id })
        if (!checkToken) {
            return res.status(StatusCodes.NOT_FOUND).send(messageFormatter.errorMsgFormat('No tokenId found', 'tokenValidation', StatusCodes.NOT_FOUND))
        }
        else
            next()
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message, 'tokenValidation', StatusCodes.BAD_REQUEST))
    }
};

module.exports = adminAuthenticator