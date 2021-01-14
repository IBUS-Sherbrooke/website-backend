const express = require('express')
const router = express.Router()
const printRequestRouter = require('./printRequest.router')

router.use('/printRequests', printRequestRouter)

module.exports = router