const printRequestCreate = require('../validators/printRequestCreate')
const printRequestUpdate = require('../validators/printRequestUpdate')
const printRequestService = require('../services/printRequest.service')

module.exports = {
 
    /* get All printRequests */
    async getPrintRequests(req, res) {
        try {
            let printRequests = await printRequestService.getPrintRequests()
            res.send(printRequests)
        } catch (e) {
            res.send('Internal server error')
        }
    },
 
    /* add printRequest */
    async addPrintRequest(req, res) {
        try {
            const { body } = req
 
            /* validate input */
            let inputIsValid = await printRequestCreate.validate(body)
 
            if(inputIsValid.error){
                res.send(inputIsValid.error.details[0].message)
            } else {
                let createdPrintRequest = await printRequestService.createPrintRequest(body)
                res.send(createdPrintRequest)
            }
        } catch (e) {
            res.send('Internal server error')
        }
    },
 
    async updatePrintRequestById(req, res) {
        try {
            const { body } = req
            const { id } = req.params
 
            /* validate input */
            let inputIsValid = await printRequestUpdate.validate(body)
 
            if(inputIsValid.error){
                res.send(inputIsValid.error.message[0].details)
            } else {
                let updatePrintRequest = await printRequestService.updatePrintRequest(id, body)
                res.send(updatePrintRequest)
            }
        } catch (e) {
            res.send('Internal server error')
        }
    },
 
    async deletePrintRequestById(req, res) {
        try {
            const { id } = req.params
            let deletePrintRequest = await printRequestService.deletePrintRequest(id)
            res.send(deletePrintRequest)
        } catch (e) {
            res.send('Internal server error')
        }
    },
}