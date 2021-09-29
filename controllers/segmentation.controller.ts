import fs, { createReadStream } from 'fs'
import path from 'path'
import {printRequestCreate, printRequestUpdateBody, printRequestUpdateQuery, printRequestGetQuery} from '../validators/printRequestValidator'
import {printRequestService} from '../services/printRequest.service'
import {octoPrintService} from '../services/octoPrintComm.service'
import {responseMessage} from './responses'
import {tmpSession, fsStore} from '../services/fsStore'


export const segmentationController  = {
 
    /* get printRequests */
    async getSegmentation(req:any, res:any) {
        if(!req.file){
            let msg:responseMessage = {message: "addPrintRequests Failed : needs a file"}
            res.status(400).json(msg);
            return
        }
        let tmp_session:tmpSession = new tmpSession(req.file.destination)
        
        try {
            const tmp_filepath:string = path.join(tmp_session.path,req.file.filename);
            //rename for unique file
            req.body.name = path.basename(req.body.name,'.dcm') + '-' + Date.now();
            req.body.filepath = req.body.name + '.dcm'
            /* validate input */
            let inputIsValid = await printRequestCreate.validate(req.body);
 
            if(inputIsValid.error){
                let msg:responseMessage = {data: inputIsValid.error.details[0].message, message: "addPrintRequests Failed : body is invalid"};
                res.status(400).json(msg);
            } else {
                req.body.status = "pending";
            }
        } catch (e) {
            let msg:responseMessage = {data: e, message: "addPrintRequests Failed"};
            res.status(400).json(msg);
        } finally {
            tmp_session.cleanSession();
        }

        let msg:responseMessage = {data: "Success", message: "getPrintRequests Success!"}


        // try {
        //     let queryIsValid = await printRequestGetQuery.validate(req.query)

        //     if(queryIsValid.error){
        //         let msg:responseMessage = {data: queryIsValid.error.details[0].message, message: "getPrintRequest failed: query is invalid"}
        //         res.status(400).json(msg)
        //     }

        //     let printRequests = await printRequestService.getPrintRequests(req.query)

        //     let msg:responseMessage = {data: printRequests, message: "getPrintRequests Success!"}
        //     res.status(200).json(msg)
        // } catch (e) {
        //     console.log(e)
        //     let msg:responseMessage = {data: e, message: "getPrintRequests Failed"}
        //     res.status(400).json(msg)
        // }
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
        
    }
}