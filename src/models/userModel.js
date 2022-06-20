const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        typeof: String,
        required: true
    },
    lastName: {
        typeof: String,
        required: true
    },
    emailId: {
        typeof: String,
        required: true
    },
    password: {
        typeof: String,
        required: true
    },
    confirmPassword: {
        typeof: String,
        required: true
    },
    profilePhoto: {
        fileName: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        fileSize: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now()
        }
    }
})

exports.userModel = new mongoose.model('user',userSchema)