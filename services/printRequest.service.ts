import {db,PrintRequestsAttributes} from '../db/index';

export const printRequestService = {
	async getPrintRequests() {
		try{
			let printRequests = await db.PrintRequests.findAll()
			return printRequests
		} catch(e) {
			throw e
		}
	},

	async getPrintRequestsMock() {
		try{
			let printRequests = "allo"
			return printRequests
		} catch(e) {
			throw e
		}
	},
	
	async createPrintRequest(printRequeststr:string){
		try{
			let printRequest:PrintRequestsAttributes = JSON.parse(printRequeststr);
			let newPrintRequest = await db.PrintRequests.create(printRequest)
			return newPrintRequest
		} catch (e){
			throw(e)
		}
	},

	async updatePrintRequest(reqid:number, printRequeststr:string){
		try{
			let printRequest:PrintRequestsAttributes = JSON.parse(printRequeststr);
			let updatedPrintRequest = await db.PrintRequests.update(printRequest, {where: {id: reqid}})
			return updatedPrintRequest
		} catch(e){
			throw e
		}
	},

	async deletePrintRequest(reqid:number){
		try{
			let deletePrintRequest = await db.PrintRequests.destroy({where: {id: reqid}})
			if(deletePrintRequest){
				return true
			}
			else{
				return false
			}
		} catch(e){
			throw e
		}
	}
}