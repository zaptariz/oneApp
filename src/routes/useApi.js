const express = require('express')
const multer = require('multer')
const fileUploader = require('../middleware/fileUploader')
const router = express.Router()
const adminAuthenticator = require('../middleware/adminAuthentication')
const userValidationMiddleware = require('../middleware/userValidationMiddleware')

const upload = multer({ storage: fileUploader.fileStorageForProfilePhoto, fileFilter: fileUploader.fileFilter })

router.post('/signup', upload.single('profilephoto'), userValidationMiddleware.signup)
router.post('/signin', userValidationMiddleware.signin)
router.delete('/signout', adminAuthenticator, userValidationMiddleware.signOut)
router.get('/dashboard', adminAuthenticator, userValidationMiddleware.dashboard)

module.exports = router