
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const jwtTokenModel = require('../models/jwtTokenModel')


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
const adminAuth = async (req, res, next) => {
    try {
        let tokenFromRequestHeader = req.headers.authtoken
        let verifyToken = await new jwt.verify(tokenFromRequestHeader, "secret")
        let checkToken = await new jwtTokenModel.findOne({ tokenId: tokenFromRequestHeader, userId: verifyToken.id })
        if (!checkToken && checkToken.sessionStatus) {
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
        return res.status(401).json({ "error_response  ": error.message });
    }
};

module.exports = adminAuth