import { expression } from "joi"
import fs, { createReadStream } from 'fs'
import path from 'path'
import {printRequestCreate, printRequestUpdateBody, printRequestUpdateQuery} from '../validators/printRequestValidator'
import {printRequestService} from '../services/printRequest.service'
import {octoPrintService} from '../services/octoPrintComm.service'
import {responseMessage} from './responses'


export const printRequestController  = {
 
    /* get All printRequests */
    async getPrintRequests(req:any, res:any) {
        try {
            let printRequests = await printRequestService.getPrintRequests()

            let msg:responseMessage = {data: printRequests, message: "getPrintRequests Success!"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)
            let msg:responseMessage = {data: e, message: "getPrintRequests Failed"}
            res.status(400).json(msg)
        }
    },

    /* get All printRequests MOCK (to delete) */
    async getPrintRequestsMock(req:any, res:any) {
        try {
            let printRequests = await printRequestService.getPrintRequestsMock()

            let msg:responseMessage = {data: printRequests, message: "getPrintRequests Success!"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)
            let msg:responseMessage = {data: e, message: "getPrintRequests Failed"}
            res.status(400).json(msg)
        }
    },
 
    /* add printRequest */
    async addPrintRequest(req:any, res:any) {
        if(!req.file){
            let msg:responseMessage = {message: "addPrintRequests Failed : needs a file"}
            res.status(400).json(msg);
            return
        }
        const tmp_filepath:string = req.file.destination + '/' + req.file.filename;
        if(!tmp_filepath.endsWith('.stl')){
            let msg:responseMessage = {message: "addPrintRequests Failed : file needs to be a .stl format"}
            res.status(400).json(msg);
            fs.unlink(tmp_filepath, ()=>{});
            return
        }
        try {

            //rename for unique file
            req.body.name = path.basename(req.body.name,'.stl') + '-' + Date.now();

            /* validate input */
            let inputIsValid = await printRequestCreate.validate(req.body);
 
            if(inputIsValid.error){
                fs.unlink(tmp_filepath, ()=>{});
                let msg:responseMessage = {data: inputIsValid.error.details[0].message, message: "addPrintRequests Failed : body is invalid"}
                res.status(400).json(msg);
            } else {
                req.body.status = "pending";

                const body:string = JSON.stringify(req.body);
                let createdPrintRequest = await printRequestService.createPrintRequest(body);

                let stlFileName = req.body.name + '.stl';
                let file_dir:string = path.join(__dirname, '../uploads', req.body.user_id, req.body.project_name);
                fs.mkdirSync(file_dir, { recursive: true });
                
                fs.renameSync(path.join(__dirname,'..',tmp_filepath), path.join(file_dir, stlFileName));

                let octoUpload_res = await octoPrintService.UploadFile(path.join(file_dir, stlFileName));
                let octo_slice_res = await octoPrintService.SliceStl(stlFileName);

                let msg:responseMessage = {data: createdPrintRequest, message: "CreatePrintRequest Success!"}
                res.status(200).json(msg);

            }
        } catch (e) {
            fs.unlink(tmp_filepath, ()=>{});
            let msg:responseMessage = {data: e, message: "addPrintRequests Failed"}
            res.status(400).json(msg)
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
                    let msg:responseMessage = {data: bodyIsValid.error.details[0].message, message: "body is invalid"}
                    res.status(400).json(msg)
                } else if(queryIsValid.error){
                    let msg:responseMessage = {data: queryIsValid.error.details[0].message, message: "query is invalid"}
                    res.status(400).json(msg)
                }
            } else {
                /*Calling the service*/
                let updatePrintRequest = await printRequestService.updatePrintRequest(user_id, project_name, name, body)

                let msg:responseMessage = {data: updatePrintRequest, message: "updatePrintRequest Success!"}
                res.status(200).json(msg)
            }
        } catch (e) {
            console.log(e)
            if(req.file){
                fs.unlink(req.body.filepath, ()=>{});
            }
            let msg:responseMessage = {data: e, message: "updatePrintRequest Failed"}
            res.status(400).json(msg)
        }
    },
 
    async deletePrintRequestByName(req:any, res:any) {
        try {
            const user_id:number = req.query.user_id
            const project_name:string = req.query.project_name
            const name:string = req.query.name
            let deletePrintRequest = await printRequestService.deletePrintRequest(user_id, project_name, name)

            let msg:responseMessage = {data: deletePrintRequest, message: "deletePrintRequest Success!"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)
            let msg:responseMessage = {data: e, message: "deletePrintRequest Failed"}
            res.status(400).json(msg)
        }
    }
}