import express from 'express';
import {printRequestController} from '../controllers/printRequest.controller';
import multer from 'multer'
const printRequestRouter = express.Router()

var storage = multer.diskStorage({
	destination: 'uploads/',
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
})
var upload = multer({storage:storage})

printRequestRouter.get('/',printRequestController.getPrintRequests)
printRequestRouter.post('/',upload.single('print_data'), printRequestController.addPrintRequest)
printRequestRouter.put('/:id',upload.single('print_data'), printRequestController.updatePrintRequestById)
printRequestRouter.delete('/:id',printRequestController.deletePrintRequestById)



//fake request for testing
printRequestRouter.get('/mock',printRequestController.getPrintRequestsMock)

export {printRequestRouter}