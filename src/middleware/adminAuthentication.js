const jwt = require('jsonwebtoken');
const {userModel} = require('../models/userModel');
const {jwtTokenModel} = require('../models/jwtTokenModel');
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
        if (!checkToken && checkToken.isDeleted) {
            throw new Error(" Token not found ")
        }
        else {
            let findEmailId = await userModel.findOne({ email: verifyToken.userEmail })
            if (findEmailId) {
                next()
            }
            else throw new Error("email id not found")
        }
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormatter.errorMsgFormat(error.message,'tokenValidation', StatusCodes.BAD_REQUEST));
    }
};

module.exports = adminAuthenticator