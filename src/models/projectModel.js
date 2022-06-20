const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    demoLink: {
        type: String,
        required: true
    },
    gitHubLink: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    descriptionByMedia: {
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
    },
        createdAt: {
        type: Date,
        default: Date.now()
    }
})

exports.projectModel = new mongoose.model('projectsByUsers',projectSchema)