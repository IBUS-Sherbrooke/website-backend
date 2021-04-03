import { workerData, parentPort } from 'worker_threads'
import {printRequestService, printState} from './printRequest.service'
import {octoPrintService} from './octoPrintComm.service'
import {PrintRequests} from '../db'
import { worker } from 'cluster'

const pollTimer = function(ms:number){
    return new Promise(res => setTimeout(res,ms))
}

async function workerStartup(){
    let printRequests = await printRequestService.getPrintRequestsPrinting();
    let nextRequest = printRequests.shift()

    while(nextRequest != undefined){
        let job = await octoPrintService.GetJobStatus();

        if(job.state != printState.PRINTING){
            nextRequest.status = job.state;
            //TODO: save the data message too (need another column in database)
            nextRequest.save();
        }
        //TODO : Start Progress reporting
        //...
        nextRequest = await printRequests.shift()?.reload();
    }
    workerLoop();
}

async function workerTask(nextRequest:PrintRequests){
    nextRequest = await nextRequest.reload();

    if(nextRequest.status != printState.WAITING){
        return
    }

    if(nextRequest != undefined) {
        let printer = await octoPrintService.GetPrinterStatus();
        while(printer.state.flags.ready != true){
            //We could eventually use the push events (socket.io) on octoprint instead
            await pollTimer(60000);
            printer = await octoPrintService.GetPrinterStatus();
        }

        try {
            octoPrintService.SliceStlAndPrint(nextRequest.filepath);
            nextRequest.status = printState.PRINTING;             //maybe move in Progress reporting but needs to be done before exiting function
            nextRequest.save();
            //TODO: save the data message too (need another column in database)
        } catch (error) {
            nextRequest.status = printState.ERROR;
            nextRequest.save();
            //TODO: save the data message too (need another column in database)
        }
        
        //TODO : Start Progress reporting
    }
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


workerStartup();