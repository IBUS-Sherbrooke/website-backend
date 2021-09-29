import express from 'express';
import {segmentationController} from '../controllers/segmentation.controller';
import multer from 'multer'
import {fsStore, tmpSession} from '../services/fsStore';
import fs, { createReadStream } from 'fs'

const segmentationRouter = express.Router()

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		let tmp_session:tmpSession = new tmpSession();
		cb(null, tmp_session.path)
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname + '-' + Date.now())
	}
})
var upload = multer({storage:storage})

segmentationRouter.get('/',upload.single('print_data'),segmentationController.getSegmentation)
segmentationRouter.post('/',upload.single('print_data'), segmentationController.addPrintRequest)



export {segmentationRouter}