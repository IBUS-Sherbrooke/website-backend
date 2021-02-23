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
	}
})

/*interface GetFilesResponse {
	files:{
		date:number;
		display:string;
		name:string;
		origin:string;
		path:string;
		size:number;
		type:string;
		refs:{
			download:string;
			resource:string;
		};
}*/

export const octoPrintService = {
	async UploadFile(fullpath:string) {
		const uploadFileRoute:string = "/files/local";

		console.log(fullpath)
		const formData:FormData = new FormData();
		formData.append('file',fs.readFileSync(fullpath),fullpath + ".gcode");
		//formData.append('select', 'false');
		//formData.append('print','false');

		const strFormData:string = JSON.stringify(formData);
		
		
		try {
			let res = await axinstance.post(uploadFileRoute,formData.getBuffer(), {
				headers: {
					...formData.getHeaders()
				}
			});

			return res;
		}catch (e) {
			console.log(e)
			throw(e);
		}
		
	},

	async GetFiles(){
		const getFilesRoute:string = "/files";
		try {
			let res = await axinstance.get(getFilesRoute)
			console.log(res.data);
			return res;
		}catch (e) {
			throw(e);
		}
		
	}
}