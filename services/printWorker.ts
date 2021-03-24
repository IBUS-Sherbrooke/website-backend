import { workerData, parentPort } from 'worker_threads'
import {printRequestService} from './printRequest.service'
import {octoPrintService} from './octoPrintComm.service'
import { db } from '../db'




let queue = printRequestService.getPrintRequestsQueue()
    .then(printRequests => console.log(printRequests))
