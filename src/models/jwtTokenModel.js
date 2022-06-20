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
    },
    sessionStatus: {
        type: Boolean,
        default: false
    }
})

//create a model for JWT token
const model = new mongoose.model('jwttoken', jwtToken)

//export the model
exports.jwtToken = model 