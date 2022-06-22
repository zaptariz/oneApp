const express = require('express')
const multer = require('multer')
const fileUploader = require('../middleware/fileUploader')
const adminAuthenticator = require('../middleware/adminAuthentication')
const projectvalidationMiddleware = require('../middleware/projectValidationMiddleware')
const upload = multer({ storage: fileUploader.fileStorage, fileFilter: fileUploader.fileFilter })

const router = express.Router()

router.get('/selfTab', adminAuthenticator, projectvalidationMiddleware.selfTab)
router.post('/addproject', adminAuthenticator, upload.single('desc'), projectvalidationMiddleware.addProject)
router.get('/allprojects', adminAuthenticator, projectvalidationMiddleware.allProjects)
router.put('/updateproject/:id', adminAuthenticator, upload.single('desc'), projectvalidationMiddleware.updateProject)
router.delete('/deleteproject/:id', adminAuthenticator, projectvalidationMiddleware.deleteProject)

module.exports = router