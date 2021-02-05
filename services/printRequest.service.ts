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
			let printRequests = "Le serveur est en train de rouler"
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

	async updatePrintRequest(req_user_id:number,req_project_name:string,req_name:string, printRequeststr:string){
		try{
			let printRequest:PrintRequestsAttributes = JSON.parse(printRequeststr);
			let updatedPrintRequest = await db.PrintRequests.update(printRequest, {where: {user_id: req_user_id, project_name: req_project_name, name: req_name}})
			return updatedPrintRequest
		} catch(e){
			throw e
		}
	},

	async deletePrintRequest(req_user_id:number,req_project_name:string,req_name:string){
		try{
			let deletePrintRequest = await db.PrintRequests.destroy({where: {user_id: req_user_id, project_name: req_project_name, name: req_name}})
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