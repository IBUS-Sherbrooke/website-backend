const express = require('express')
const printRequestController = require('../controllers/printRequest.controller')
const router = express.Router()

router.get('/',printRequestController.getPrintRequests)
router.post('/',printRequestController.addPrintRequest)
router.put('/:id',printRequestController.updatePrintRequestById)
router.delete('/:id',printRequestController.deletePrintRequestById)

module.exports = router