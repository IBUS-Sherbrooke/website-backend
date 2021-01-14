const db = require('../db/index');

module.exports = {
	async getPrintRequests() {
		try{
			let printRequests = await db.PrintRequests.findAll()
			return printRequests
		} catch(e) {
			throw e
		}
	},
	
	async createPrintRequest(printRequest){
		try{
			let newPrintRequest = await db.PrintRequest.create(printRequest)
			return newPrintRequest
		} catch (e){
			throw(e)
		}
	},

	async updatePrintRequest(reqid, printRequest){
		try{
			let updatedPrintRequest = await db.PrintRequest.update(printRequest, {where: {id: reqid}})
			return updatedPrintRequest
		} catch(e){
			throw e
		}
	},

	async deletePrintRequest(reqid){
		try{
			let deletePrintRequest = await db.PrintRequest.destroy({where: {id: reqid}})
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