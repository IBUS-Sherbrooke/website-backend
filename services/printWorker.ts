import { workerData, parentPort } from 'worker_threads'
import {printRequestService, requestState} from './printRequest.service'
import {octoPrintService} from './octoPrintComm.service'
import {db,PrintRequests} from '../db'
import { worker } from 'cluster'

const pollTimer = function(ms:number){
    return new Promise(res => setTimeout(res,ms))
}

async function workerLoop() {
    let printRequests = await printRequestService.getPrintRequestsQueue();
    let nextRequest = printRequests.shift()

    while(true){
        while(nextRequest == undefined){
            await pollTimer(60000) //wait 1 minute
            printRequests = await printRequestService.getPrintRequestsQueue();
            nextRequest = printRequests.shift()
        }

        while(nextRequest!=undefined){
            await workerTask(nextRequest);
            nextRequest = await printRequests.shift()?.reload()
        }
    }
}

async function workerTask(nextRequest:PrintRequests){
    nextRequest = await nextRequest.reload();

    if(nextRequest?.status == requestState.PRINTING){
        let job = await octoPrintService.GetJobStatus();

        if(job.state != requestState.PRINTING){
            nextRequest.status = job.state;
            //TODO: save the data message too (need another column in database)
            nextRequest.save();
        }
        //TODO : Start Progress reporting
    } 
    else if(nextRequest != undefined) {
        let printer = await octoPrintService.GetPrinterStatus();
        if(printer.state.flags.ready == true){
            octoPrintService.SliceStlAndPrint(nextRequest.filepath)
            //TODO : Start Progress reporting
        }
    }
}

workerLoop();

