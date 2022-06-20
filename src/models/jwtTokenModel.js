//required module
const mongoose = require('mongoose')

//Schema for save the JWTtoken for user login session
const jwtToken = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tokenId: {
        type: String,
        index: true
    }
})

//create a model for JWT token
exports.jwtTokenModel = new mongoose.model('jwttoken', jwtToken)