import {Op } from 'sequelize';
import {db,PrintRequestsAttributes,PrintRequests} from '../db/index';
import {octoPrintService,JobInformation} from './octoPrintComm.service'

export const printState = {
	WAITING: "pending",
	PRINTING: "printing",
	DONE: "done",
	CANCELLED: "cancelled",
	ERROR: "error"
}

declare interface JobProgress {
	user_id:number,
	project_name:string,
	name:string
	progress:JobInformation
}

declare interface PrintRequestAndProgress{
	printrequests:PrintRequests[],
	jobsProgress?: JobProgress[]
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
			let printRequestsAndProgress:PrintRequestAndProgress = {
				printrequests: await db.PrintRequests.findAll({where: param}),
			} 

			let jobsProgress:JobProgress[] = [];
			//TODO: SUPPORT MULTIPLE PRINTERS. right now it always fetches the same job on the same printer, but we only have 1 printer
			printRequestsAndProgress.printrequests.forEach(async printEntry => {
				if(printEntry.status == printState.PRINTING){
					let jobprogress:JobProgress = {
						user_id: printEntry.user_id,
						project_name: printEntry.project_name,
						name:printEntry.name,
						progress: await octoPrintService.GetJobStatus()
					}

					//save state if Done or ERROR
					if(jobprogress.progress.state == printState.ERROR){
						let status_data:string = JSON.stringify({status_message:jobprogress.progress});
						this.updatePrintRequest(jobprogress.user_id,jobprogress.project_name,jobprogress.name,status_data);
					}
					else if (jobprogress.progress.state == "Operational") {
						let status:string = JSON.stringify({status:printState.DONE});
						this.updatePrintRequest(jobprogress.user_id,jobprogress.project_name,jobprogress.name,status);
					}

					jobsProgress.push(jobprogress)
				}
			});

			printRequestsAndProgress.jobsProgress = jobsProgress;

			return printRequestsAndProgress
		} catch(e) {
			throw e
		}
	},

	async getPrintRequestsQueue() {
		try{
			let printRequests = await db.PrintRequests.findAll({
				where:{
					status: {
						[Op.or]:[printState.PRINTING, printState.WAITING]
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
					status: printState.PRINTING
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