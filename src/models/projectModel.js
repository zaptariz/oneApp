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
    demolink: {
        type: String,
        required: true
    },
    githublink: {
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
        filePath: {
            type: String,
        }
    }
},{
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})

exports.projectModel = new mongoose.model('projectsByUsers', projectSchema)