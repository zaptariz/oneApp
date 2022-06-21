const router = require('express').Router()
const userApi = require('./useApi')
const projectsApi = require('./projectsApi')

router.use('/user', userApi)
router.use('/projects', projectsApi)
module.exports = router