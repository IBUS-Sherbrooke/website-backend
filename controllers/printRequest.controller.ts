import { expression } from "joi"
import fs from 'fs'
import path from 'path'
import {printRequestCreate, printRequestUpdateBody, printRequestUpdateQuery} from '../validators/printRequestValidator'
import {printRequestService} from '../services/printRequest.service'
import {octoPrintService} from '../services/octoPrintComm.service'


export const printRequestController  = {
 
    /* get All printRequests */
    async getPrintRequests(req:any, res:any) {
        try {
            let printRequests = await printRequestService.getPrintRequests()
            res.send(printRequests)
        } catch (e) {
            console.log(e)
            res.send(`getPrintRequests Failed : ${e}`)
        }
    },

    /* get All printRequests MOCK (to delete) */
    async getPrintRequestsMock(req:any, res:any) {
        try {
            let printRequests = await printRequestService.getPrintRequestsMock()
            res.send(printRequests)
        } catch (e) {
            console.log(e)
            res.send(`getPrintRequests Failed : ${e}`)
        }
    },
 
    /* add printRequest */
    async addPrintRequest(req:any, res:any) {
        if(!req.file){
            res.send(`addPrintRequests Failed : missing print data file`)
            return
        }
        const tmp_filepath:string = req.file.destination + '/' + req.file.filename
        console.log(tmp_filepath)
        if(!tmp_filepath.endsWith('.stl')){
            res.send(`addPrintRequests Failed : file needs to be a .stl format`)
            fs.unlink(tmp_filepath, ()=>{});
            return
        }
        try {

            //rename for unique file
            req.body.name = path.basename(req.body.name,'.stl') + '-' + Date.now()

            /* validate input */
            let inputIsValid = await printRequestCreate.validate(req.body)
 
            if(inputIsValid.error){
                fs.unlink(tmp_filepath, ()=>{});
                res.send(inputIsValid.error.details[0].message)
            } else {
                req.body.status = "pending";

                const body:string = JSON.stringify(req.body);
                let createdPrintRequest = await printRequestService.createPrintRequest(body);
                let file_dir:string = path.join(__dirname, '../uploads', req.body.user_id, req.body.project_name);
                fs.mkdirSync(file_dir, { recursive: true });
                let stlFileName = req.body.name + '.stl'
                fs.renameSync(path.join(__dirname,'..',tmp_filepath), path.join(file_dir, stlFileName));

                let octoUpload_res = await octoPrintService.UploadFile(path.join(file_dir, stlFileName));
                let octo_slice_res = await octoPrintService.SliceStl(stlFileName);

                res.send(createdPrintRequest)

            }
        } catch (e) {
            fs.unlink(tmp_filepath, ()=>{});
            res.send(`addPrintRequests Failed : ${e}`)
        }
    },
 
    async updatePrintRequestByName(req:any, res:any) {
        try {
            if(req.file){
                req.body.filepath = req.file.destination + req.file.filename
            }
            
            const body:string = JSON.stringify(req.body)
            const user_id:number = req.query.user_id
            const project_name:string = req.query.project_name
            const name:string = req.query.name
            /* validate input */
            let bodyIsValid = await printRequestUpdateBody.validate(req.body)
            let queryIsValid = await printRequestUpdateQuery.validate(req.query)

            if(bodyIsValid.error || queryIsValid.error){
                if(req.file){
                    fs.unlink(req.body.filepath, ()=>{});
                }
                if(bodyIsValid.error){
                    res.send("body: " + bodyIsValid.error.details[0].message)
                } else if(queryIsValid.error){
                    res.send("param: " + queryIsValid.error.details[0].message)
                }
            } else {
                /*Calling the service*/
                let updatePrintRequest = await printRequestService.updatePrintRequest(user_id, project_name, name, body)
                res.send(updatePrintRequest)
            }
        } catch (e) {
            console.log(e)
            if(req.file){
                fs.unlink(req.body.filepath, ()=>{});
            }
            res.send(`updatePrintRequest Failed : ${e}`)
        }
    },
 
    async deletePrintRequestByName(req:any, res:any) {
        try {
            const user_id:number = req.query.user_id
            const project_name:string = req.query.project_name
            const name:string = req.query.name
            let deletePrintRequest = await printRequestService.deletePrintRequest(user_id, project_name, name)
            res.send(deletePrintRequest)
        } catch (e) {
            console.log(e)
            res.send(`deletePrintRequest Failed : ${e}`)
        }
    }
}