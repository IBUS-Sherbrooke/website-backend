import {config} from '../configs/config' 
import fs from 'fs'
import path from 'path'
import {v4 as uuidv4} from 'uuid'

const rootDir:string = path.join(__dirname, '../uploads');
const tmp_dir:string = path.join(rootDir,'tmp');



export const fsStore = {
	getProjectFiles(user_id:number, project_name:string) {
		
	},
	
	getProjects(user_id:number) {

	}
}

export class tmpSession {
	path:string = path.join(tmp_dir,uuidv4());
	constructor(tmpDir?:string){
		if(tmpDir){
			this.path = tmpDir;
		}
	}
	
	cleanSession(){
		fs.rmdir(this.path,{ recursive: true },()=>{});
	}
}