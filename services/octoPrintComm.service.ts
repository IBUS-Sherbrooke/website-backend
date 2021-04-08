import axios from 'axios'
import {config} from '../configs/config' 
import fs from 'fs'
import FormData from 'form-data'

const octoPrintToken:string = "53C2F1A7195A4330AE89136B24937A0C"
const rootApi:string =  "http://" + config.octoprint.host + ":" + config.octoprint.port + "/api"
const axinstance = axios.create({
	baseURL: rootApi,
	headers: {
		"X-Api-Key": octoPrintToken
	},
	maxContentLength: Infinity,
    maxBodyLength: Infinity,
})


export declare interface JobInformation {
	job: {
		file: {
		  name: string,
		  origin: string,
		  size: number,
		  date: number
		},
		estimatedPrintTime: number,
		filament: {
		  tool0: {
			length: number,
			volume: number
		  }
		}
	},
	progress: {
		completion: number,
		filepos: number,
		printTime: number,
		printTimeLeft: number
	},
	state: string
}

declare interface PrinterInformation {
	state: {
		text: string,
		flags: {
		  operational: boolean,
		  paused: boolean,
		  printing: boolean,
		  cancelling: boolean,
		  pausing: boolean,
		  sdReady: boolean,
		  error: boolean,
		  ready: boolean,
		  closedOrError: boolean
		}
	  }
}

export const octoPrintService = {
	jobENUM:{
		START: "start",
		CANCEL: "cancel",
		RESTART: "restart",
		PAUSE: "pause",
		RESUME: "resume",
		TOGGLE: "toggle"
	},


	async UploadFile(fullpath:string) {
		const uploadFileRoute:string = "/files/local";

		let formData:FormData = new FormData();
		formData.append('file',fs.readFileSync(fullpath),fullpath);
		formData.append('path','/stl')
		//formData.append('select', 'false');
		//formData.append('print','false');	
		
		try {
			let res = await axinstance.post(uploadFileRoute,formData.getBuffer(), {
				headers: {
					...formData.getHeaders()
				}
			});

			return res.data;
		}catch (e) {
			console.log(e)
			throw(e);
		}
		
	},

	async GetFiles(){
		const getFilesRoute:string = "/files";
		try {
			let res = await axinstance.get(getFilesRoute);
			return res.data;
		}catch (e) {
			throw(e);
		}
		
	},

	async SliceStlAndPrint(filename:string){
		const stlFileRoute:string = "/files/local/stl/" + filename;

		let payload = {
			command : 'slice',
			slicer : 'curalegacy',
			gcode : `../gcode/${filename.replace('.stl','.gcode')}`,
			//print: true
		};

		try {
			let res = await axinstance.post(stlFileRoute,payload, {
				headers: {
					'Content-type' : 'application/json'
				}
			});
			console.log(res.data);
			return res.data;
		}catch (e) {
			console.log(e)
			throw(e);
		}
		
	},

	async SendJobCommand(cmd:string){
		const jobRoute:string = "/job";

		let payload;
		if(cmd == this.jobENUM.PAUSE || cmd == this.jobENUM.RESUME || cmd == this.jobENUM.TOGGLE ){
			payload = {
				command : cmd,
				action : cmd
			}
		} else {
			payload = {
				command : cmd
			}
		}

		try {
			let res = await axinstance.post(jobRoute,payload, {
				headers: {
					'Content-type' : 'application/json'
				}
			});
			console.log(res.data);
			return res.data;
		}catch (e) {
			console.log(e)
			throw(e);
		}

	},
 
	async GetJobStatus(){
		const jobRoute:string = "/job";

		try {
			let res = await axinstance.get<JobInformation>(jobRoute, {
				headers: {
					'Content-type' : 'application/json'
				}
			});
			console.log(res.data);
			return res.data;
		}catch (e) {
			console.log(e)
			throw(e);
		}
	},

	async GetPrinterStatus(){
		const printerRoute:string = "/printer?exclude=temperature,sd";

		try {
			let res = await axinstance.get<PrinterInformation>(printerRoute, {
				headers: {
					'Content-type' : 'application/json'
				}
			});
			console.log(res.data);
			return res.data;
		}catch (e) {
			console.log(e)
			throw(e);
		}
	}
}