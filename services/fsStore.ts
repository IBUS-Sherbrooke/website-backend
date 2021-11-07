import {config} from '../configs/config' 
import fs, { mkdirSync, rmdir, rmdirSync } from 'fs'
import path from 'path'
import {v4 as uuidv4} from 'uuid'

const rootDir:string = path.join(__dirname, '../uploads');
const tmp_dir:string = path.join(rootDir,'tmp');



export const fsStore = {
	addProject(user_id:string, project_name:string) {
		fs.mkdirSync(path.join(rootDir, user_id,project_name), {recursive: true});
		return path.join(rootDir, user_id,project_name)
	},

	renameProject(user_id:string, old_project_name:string, new_project_name:string) {
		let old_path:string = path.join(rootDir, user_id, old_project_name);
		let new_path:string = path.join(rootDir, user_id, new_project_name);
		fs.renameSync(old_path, new_path);
		return new_path;
	},

	deleteProject(user_id:string, project_name:string) {
		fs.rmSync(path.join(rootDir,user_id,project_name), { recursive: true });
	},
	saveFileData(tmp_filepath:string,user_id:string, project_name:string, printName:string) {
		let file_dir:string = path.join(rootDir, user_id, project_name);
		fs.mkdirSync(file_dir, { recursive: true });
		let save_file_path:string = path.join(file_dir, printName);
		fs.renameSync(tmp_filepath, save_file_path);

		return save_file_path;
	},
	savePrintData(tmp_filepath:string,user_id:string, project_name:string, printName:string) {
		let file_dir:string = path.join(rootDir, user_id, project_name);
		fs.mkdirSync(file_dir, { recursive: true });
		let save_file_path:string = path.join(file_dir, printName);
		fs.renameSync(tmp_filepath, save_file_path);

		return save_file_path;
	},

	deletePrintData(user_id:string, project_name:string, printName:string) {
		fs.rmSync(path.join(rootDir,user_id,project_name,printName))
	}

}

export class tmpSession {
	path:string = path.join(tmp_dir,uuidv4());
	constructor(tmpDir?:string){
		if(tmpDir){
			this.path = tmpDir;
		}
		fs.mkdirSync(this.path, { recursive: true })
	}
	
	cleanSession(){
		fs.rmdir(this.path,{ recursive: true },()=>{});
	}
}