import fs, { createReadStream } from 'fs'
import path from 'path'
import {printRequestCreate, printRequestUpdateBody, printRequestUpdateQuery, printRequestGetQuery} from '../validators/printRequestValidator'
import {printRequestService} from '../services/printRequest.service'
import {octoPrintService} from '../services/octoPrintComm.service'
import {responseMessage} from './responses'
import {tmpSession, fsStore} from '../services/fsStore'


export const printRequestController  = {
 
    /* get printRequests */
    async getPrintRequests(req:any, res:any) {
        try {
            let queryIsValid = await printRequestGetQuery.validate(req.query)

            if(queryIsValid.error){
                let msg:responseMessage = {data: queryIsValid.error.details[0].message, message: "getPrintRequest failed: query is invalid"}
                res.status(400).json(msg)
            }

            let printRequests = await printRequestService.getPrintRequests(req.query)

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
        let tmp_session:tmpSession = new tmpSession(req.file.destination)
        
        try {
            const tmp_filepath:string = path.join(tmp_session.path,req.file.filename);
            //rename for unique file
            req.body.name = path.basename(req.body.name,'.stl') + '-' + Date.now();
            req.body.filepath = req.body.name + '.stl'

            /* validate input */
            let inputIsValid = await printRequestCreate.validate(req.body);
 
            if(inputIsValid.error){
                let msg:responseMessage = {data: inputIsValid.error.details[0].message, message: "addPrintRequests Failed : body is invalid"};
                res.status(400).json(msg);
            } else {
                req.body.status = "pending";

                const body:string = JSON.stringify(req.body);
                let createdPrintRequest = await printRequestService.createPrintRequest(body);

                let stlFileName = req.body.name + '.stl';
                let printData_path:string = fsStore.savePrintData(tmp_filepath,req.body.user_id, req.body.project_name, stlFileName)

                let octoUpload_res = await octoPrintService.UploadFile(printData_path);
                let octo_slice_res = await octoPrintService.SliceStlAndPrint(stlFileName);
                

                let msg:responseMessage = {data: createdPrintRequest, message: "CreatePrintRequest Success!"};
                res.status(200).json(msg);

            }
        } catch (e) {
            let msg:responseMessage = {data: e, message: "addPrintRequests Failed"};
            res.status(400).json(msg);
        } finally {
            tmp_session.cleanSession();
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
            let msg:responseMessage = {data: e, message: "updatePrintRequest Failed"}
            res.status(400).json(msg)
        } finally {
            if(req.file){
                fs.unlink(req.body.filepath, ()=>{});
            }
        }

    },
 
    async deletePrintRequestByName(req:any, res:any) {
        try {
            const user_id:number = req.query.user_id
            const project_name:string = req.query.project_name
            const name:string = req.query.name
            
            let deletePrintRequest = await printRequestService.deletePrintRequest(user_id, project_name, name)
            fsStore.deletePrintData(user_id.toString(), project_name, name)

            let msg:responseMessage = {data: deletePrintRequest, message: "deletePrintRequest Success!"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)
            let msg:responseMessage = {data: e, message: "deletePrintRequest Failed"}
            res.status(400).json(msg)
        }
    }
}