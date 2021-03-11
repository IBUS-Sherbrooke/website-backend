import { expression } from "joi"
import {printRequestHistoryService} from '../services/printRequestHistory.service'
import {responseMessage} from './responses'

export const printRequestHistoryController  = {
 
    /* get All printRequests */
    async getPrintRequestsHistory(req:any, res:any) {
        try {
            let printRequestsHistory = await printRequestHistoryService.getPrintRequestsHistory()

            let msg:responseMessage = {data: printRequestsHistory, message: "getPrintRequestHistory success!"}
            res.status(200).json(msg)
        } catch (e) {
            let msg:responseMessage = {data: e, message: "getPrintRequestsHistory failed"}
            res.status(400).json(msg)
        }
    },

    /* get All printRequests MOCK (to delete) */
    async getPrintRequestsMock(req:any, res:any) {
        try {
            let printRequestsHistory = await printRequestHistoryService.getPrintRequestsHistoryMock()
            
            let msg:responseMessage = {data: printRequestsHistory, message: "getPrintRequestHistory success!"}
            res.status(200).json(msg)
        } catch (e) {
            let msg:responseMessage = {data: e, message: "getPrintRequestsHistory failed"}
            res.status(400).json(msg)
        }
    }
}