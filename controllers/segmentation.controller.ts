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
        console.log(req)

        var exec = require('child_process').execFile
        console.log("File received and saved")
        console.log("Starting segmentation")
        // Executable, Folder dicom, output folder name, x, y, z, lower threshold, upper threshold
        console.log(printData_path)
        console.log("x:  ",req.body.x)
        console.log("y:  ",req.body.y)
        console.log("z:  ",req.body.z)
        exec('./segmentation/ConnectedThresholdImageFilter.exe',[printData_path, "./segmentation/segmentation_output.nrrd", req.body.x, req.body.y,req.body.z, "900" ,"5000"], { cwd: '.' }, function(err: any, data: any) {  
            console.log("Finished segmentation")
            let msg:responseMessage = {data: "Success", message: "getPrintRequests Success!"}
            res.sendFile("segmentation_output.nrrd", { root: './segmentation/' });
            console.log("Response sent")
            
        })
       

    }
}