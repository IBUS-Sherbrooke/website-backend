import express from 'express';
import {printRequestController} from '../controllers/printRequest.controller';
import multer from 'multer'
import {tmpSession} from '../services/fsStore';

const printRequestRouter = express.Router()

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		let tmp_session:tmpSession = new tmpSession();
		cb(null, tmp_session.path)
	},
	filename: function(req, file, cb) {
		cb(null, '-' + Date.now() + file.originalname)
	}
})
var upload = multer({storage:storage})

printRequestRouter.get('/',printRequestController.getPrintRequests)
printRequestRouter.post('/',upload.single('print_data'), printRequestController.addPrintRequest)
printRequestRouter.put('/',upload.single('print_data'), printRequestController.updatePrintRequestByName)
printRequestRouter.delete('/',printRequestController.deletePrintRequestByName)



//fake request for testing
printRequestRouter.get('/mock',printRequestController.getPrintRequestsMock)

export {printRequestRouter}