import { Op } from 'sequelize';
import {db,PrintRequestsAttributes} from '../db/index';

export const requestState = {
	WAITING: "pending",
	PRINTING: "printing",
	DONE: "done",
	CANCELLED: "cancelled",
	ERROR: "error"
}

export const printRequestService = {
	async getPrintRequests(query:any) {
		let param:any = {user_id: query.user_id}
		if(query.project_name){
			param.project_name = query.project_name
		}
		if(query.name){
			param.name = query.name
		}

		try{
			let printRequests = await db.PrintRequests.findAll({where: param})
			return printRequests
		} catch(e) {
			throw e
		}
	},

	async getPrintRequestsQueue() {
		try{
			let printRequests = await db.PrintRequests.findAll({
				where:{
					status: {
						[Op.or]:[requestState.PRINTING, requestState.WAITING]
					}
				},
				order:[['created_at','ASC']]
			});
				
			return printRequests
		} catch(e) {
			throw e
		}
	},

	async getPrintRequestsPrinting() {
		try{
			let printRequests = await db.PrintRequests.findAll({
				where:{
					status: {
						[Op.or]:[requestState.PRINTING]
					}
				},
				order:[['created_at','ASC']]
			});
				
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