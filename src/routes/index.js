const router = require('express').Router()
const userApi  = require('./useApi')

router.use('/user',userApi)

module.exports = router