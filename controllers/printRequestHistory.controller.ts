import { expression } from "joi"
import {printRequestHistoryService} from '../services/printRequestHistory.service'


export const printRequestHistoryController  = {
 
    /* get All printRequests */
    async getPrintRequestsHistory(req:any, res:any) {
        try {
            let printRequestsHistory = await printRequestHistoryService.getPrintRequestsHistory()
            res.send(printRequestsHistory)
        } catch (e) {
            res.send(`getPrintRequestsHistory Failed : ${e}`)
        }
    },

    /* get All printRequests MOCK (to delete) */
    async getPrintRequestsMock(req:any, res:any) {
        try {
            let printRequestsHistory = await printRequestHistoryService.getPrintRequestsHistoryMock()
            res.send(printRequestsHistory)
        } catch (e) {
            res.send(`getPrintRequestsHistory Failed : ${e}`)
        }
    }
}