const express = require('express')
const multer = require('multer')
const fileUploader = require('../middleware/fileUploader')
const adminAuthenticator = require('../middleware/adminAuthentication')
const userValidationoMiddleware = require('../middleware/userValidationMiddleware')
const upload = multer({ storage: fileUploader.fileStorage, fileFilter: fileUploader.fileFilter })

const router = express.Router()

router.post('/signup', upload.single('profilephoto'), userValidationoMiddleware.signUp)
router.post('/signin', userValidationoMiddleware.signIn)
router.delete('/signout', adminAuthenticator, userValidationoMiddleware.signOut)
router.get('/dashboard', adminAuthenticator, userValidationoMiddleware.dashboard)

module.exports = router