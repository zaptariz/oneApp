const router = require('express').Router()
const signup  = require('./useApi')

router.use('/user',signup)

module.exports = router