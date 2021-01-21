import express from 'express';
import {printRequestHistoryController} from '../controllers/printRequestHistory.controller';
const printRequestHistoryRouter = express.Router()

printRequestHistoryRouter.get('/',printRequestHistoryController.getPrintRequestsHistory)

//fake request for testing
printRequestHistoryRouter.get('/mock',printRequestHistoryController.getPrintRequestsMock)

export {printRequestHistoryRouter}