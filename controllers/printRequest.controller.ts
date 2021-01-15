import { expression } from "joi"

import {printRequestCreate} from '../validators/printRequestCreate'
import {printRequestUpdate} from '../validators/printRequestUpdate'
import {printRequestService} from '../services/printRequest.service'


export const printRequestController  = {
 
    /* get All printRequests */
    async getPrintRequests(req:any, res:any) {
        try {
            let printRequests = await printRequestService.getPrintRequests()
            res.send(printRequests)
        } catch (e) {
            res.send(`getPrintRequests Failed : ${e}`)
        }
    },
 
    /* add printRequest */
    async addPrintRequest(req:any, res:any) {
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
            res.send(`addPrintRequests Failed : ${e}`)
        }
    },
 
    async updatePrintRequestById(req:any, res:any) {
        try {
            const { body } = req
            const { id } = req.params
 
            /* validate input */
            let inputIsValid = await printRequestUpdate.validate(body)
 
            if(inputIsValid.error){
                res.send(inputIsValid.error.details[0].message)
            } else {
                let updatePrintRequest = await printRequestService.updatePrintRequest(id, body)
                res.send(updatePrintRequest)
            }
        } catch (e) {
            res.send(`updatePrintRequest Failed : ${e}`)
        }
    },
 
    async deletePrintRequestById(req:any, res:any) {
        try {
            const { id } = req.params
            let deletePrintRequest = await printRequestService.deletePrintRequest(id)
            res.send(deletePrintRequest)
        } catch (e) {
            res.send(`deletePrintRequest Failed : ${e}`)
        }
    }
}