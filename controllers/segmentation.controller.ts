import fs, { createReadStream } from 'fs'
import path from 'path'
import {printRequestCreate, printRequestUpdateBody, printRequestUpdateQuery, printRequestGetQuery} from '../validators/printRequestValidator'
import {printRequestService} from '../services/printRequest.service'
import {octoPrintService} from '../services/octoPrintComm.service'
import {responseMessage} from './responses'
import {tmpSession, fsStore} from '../services/fsStore'
const { execFile } = require('child_process');
var dicom = require('dicom-parser');


export const segmentationController  = {

    async postSegmentation(req:any, res:any) {
        let tmp_filepath:string
        let tmp_session:tmpSession
        let file
        let printData_path
        
        let dicom_directory=req.body.project_name+"/dcm_folder/"
        let file_path= "uploads/"+req.body.user_id+"/"+req.body.project_name+"/dcm_folder/"
        console.log("File received, emptying directory")
        fs.readdir(file_path, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(file_path, file), err => {
                if (err) throw err;
              });
            }
          });
        console.log("Saving file to work directory")
        for (var i = 0; i < req.files.length; i++) {  
        file=req.files[i]
        tmp_session = new tmpSession(file.destination)
        tmp_filepath = path.join(tmp_session.path,file.filename);
        //rename for unique file
        let stlFileName =file.filename + '.dcm';
        printData_path=fsStore.saveFileData(tmp_filepath,req.body.user_id, dicom_directory, stlFileName)
        }
        

        var exec = require('child_process').execFile
        console.log("File received and saved")
        console.log("Starting segmentation")
        // Executable, Folder dicom, output folder name, x, y, z, lower threshold, upper threshold
        console.log(printData_path)
        exec('./segmentation/ConnectedThresholdImageFilter.exe',[printData_path, "./segmentation/segmentation_output.nrrd", "112", "330","45", "900" ,"5000"], { cwd: '.' }, function(err: any, data: any) {  
            console.log("Finished segmentation")
            let msg:responseMessage = {data: "Success", message: "getPrintRequests Success!"}
            res.sendFile("segmentation_output.nrrd", { root: './segmentation/' });
           // res.status(200).json(msg)
            
        })
       

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