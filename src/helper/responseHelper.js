const express = require('express')
const messageFormatter = require('../utils/messageFormatter')
exports.response = (req, res) => {
    let { data, statuscode, type = '', messgae = '' } = req
    let send = messageFormatter.successFormat(data, statuscode, type, messgae)
    let status = statuscode
    return { status, send }
}