import {db} from '../db/index';

export const printRequestHistoryService = {
	async getPrintRequestsHistory() {
		try{
			let printRequestsHistory = await db.PrintRequestsHistory.findAll()
			return printRequestsHistory
		} catch(e) {
			throw e
		}
	},

	async getPrintRequestsHistoryMock() {
		try{
			let printRequestsHistory = "allo allo history"
			return printRequestsHistory
		} catch(e) {
			throw e
		}
	}
}