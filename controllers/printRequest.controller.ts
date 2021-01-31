import { expression } from "joi"
import fs from 'fs'
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

    /* get All printRequests MOCK (to delete) */
    async getPrintRequestsMock(req:any, res:any) {
        try {
            let printRequests = await printRequestService.getPrintRequestsMock()
            res.send(printRequests)
        } catch (e) {
            res.send(`getPrintRequests Failed : ${e}`)
        }
    },
 
    /* add printRequest */
    async addPrintRequest(req:any, res:any) {
        try {
            if(!req.file){
                res.send(`addPrintRequests Failed : missing print data file`)
                return
            }
            req.body.filepath = req.file.destination + req.file.filename
            const body:string = JSON.stringify(req.body)
            /* validate input */
            let inputIsValid = await printRequestCreate.validate(req.body)
 
            if(inputIsValid.error){
                fs.unlink(req.body.filepath, ()=>{});
                res.send(inputIsValid.error.details[0].message)
            } else {
                let createdPrintRequest = await printRequestService.createPrintRequest(body)
                res.send(createdPrintRequest)
            }
        } catch (e) {
            fs.unlink(req.body.filepath, ()=>{});
            res.send(`addPrintRequests Failed : ${e}`)
        }
    },
 
    async updatePrintRequestById(req:any, res:any) {
        try {
            if(req.file){
                req.body.filepath = req.file.destination + req.file.filename
            }
            
            const body:string = JSON.stringify(req.body)
            const id:number = req.params.id
            
            /* validate input */
            let inputIsValid = await printRequestUpdate.validate(req.body)
            console.log(id)
            if(inputIsValid.error){
                if(req.file){
                    fs.unlink(req.body.filepath, ()=>{});
                }
                res.send(inputIsValid.error.details[0].message)
            } else {
                let updatePrintRequest = await printRequestService.updatePrintRequest(id, body)
                res.send(updatePrintRequest)
            }
        } catch (e) {
            if(req.file){
                fs.unlink(req.body.filepath, ()=>{});
            }
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