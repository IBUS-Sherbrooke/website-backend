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
        let printData_path = []
        console.log(req.files)
        let dicom_directory=req.body.project_name+"/dcm_folder/"
        for (var i = 0; i < req.files.length; i++) {  
        file=req.files[i]
        tmp_session = new tmpSession(file.destination)
        tmp_filepath = path.join(tmp_session.path,file.filename);
        //rename for unique file
        let stlFileName =file.filename + '.dcm';
        printData_path.push(fsStore.savePrintData(tmp_filepath,req.body.user_id, dicom_directory, stlFileName))
        
        console.log(printData_path)
        }
        
        console.log(req.body)
        console.log(req.body.print_data);
        console.log(Object.keys(req.body))

       // var buf = Buffer.from(req.body.print_data, 'base64');
       // console.log(buf.toJSON())
       // fs.writeFile("./test.dcm", buf, function(err) {
        //    if(err) {
        //      console.log("err", err);
        //    } else {
        //      return res.json({'status': 'success'});
        //    }
       //   }); 

        //const obj = JSON.parse("./test.dcm")
        //console.log(obj)
      //  let formData:FormData = new FormData();
		//formData.append('file',fs.readFileSync(fullpath),fullpath);
		//formData.append('path','/stl')
		//formData.append('select', 'false');
	//	formData.append('print','false');	

    //var dataSet = dicom.parseDicom(req.file);
      //  console.log(typeof dataSet)
      //  var pixelData = new Uint8Array(dataSet.byteArray.buffer, 
      //      dataSet.elements.x00880200.items[0].dataSet.elements.x7fe00010.dataOffset, 
     //       dataSet.elements.x00880200.items[0].dataSet.elements.x7fe00010.length);
      // fs.writeFileSync('temp_segmentation.dcm', req.print_data);
      //  fs.writeFile("temp_segmentation", req.file, function (err) {
      //  console.log(err);
      //  })
        var exec = require('child_process').execFile
        console.log("Starting segmentation")
        exec('./segmentation/ConnectedThresholdImageFilter.exe',["./segmentation/brain_019.dcm", "./segmentation/abc.png", "100", "100", "400" ,"800"], { cwd: '.' }, function(err: any, data: any) {  
            console.log("Finished segmentation")
            let msg:responseMessage = {data: "Success", message: "getPrintRequests Success!"}
            res.sendFile("abc.png", { root: './segmentation/' });
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