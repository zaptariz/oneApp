const express = require('express')
const multer = require('multer')
const fileUploader = require('../middleware/fileUploader')
const router = express.Router()
const adminAuthenticator = require('../middleware/adminAuthentication')
const projectValidatinMiddleware = require('../middleware/projectValidationMiddleware')

const upload = multer({
    storage: fileUploader.fileStorageForDescriptionMedia, fileFilter: fileUploader.fileFilter
})

router.get('/selfTab', adminAuthenticator, projectValidatinMiddleware.selfTab)
router.post('/addproject', adminAuthenticator, upload.single('desc'), projectValidatinMiddleware.addProject)
router.get('/allprojects', adminAuthenticator, projectValidatinMiddleware.allProjects)
router.put('/updateproject/:id', adminAuthenticator, upload.single('desc'), projectValidatinMiddleware.updateProject)
router.delete('/deleteproject/:id', adminAuthenticator, projectValidatinMiddleware.deleteProject)

module.exports = router