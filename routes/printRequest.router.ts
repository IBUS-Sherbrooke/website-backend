import express from 'express';
import {printRequestController} from '../controllers/printRequest.controller';
//const printRequestController = require('../controllers/printRequest.controller')
const printRequestRouter = express.Router()

printRequestRouter.get('/',printRequestController.getPrintRequests) 
printRequestRouter.post('/',printRequestController.addPrintRequest)
printRequestRouter.put('/:id',printRequestController.updatePrintRequestById)
printRequestRouter.delete('/:id',printRequestController.deletePrintRequestById)

export {printRequestRouter}