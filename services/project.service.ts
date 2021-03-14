import {db,ProjectsAttributes} from '../db/index';

export const projectService = {
	async getProjects(query:any) {
		try{
			let param:any = {user_id: query.user_id}
			if(query.name){
				param.name = query.name
			}

			let projects = await db.Projects.findAll({where: param})
			return projects
		} catch(e) {
			throw e
		}
	},

	async getProjectsMock() {
		try{
			let projects = "getProjectMock"
			return projects
		} catch(e) {
			throw e
		}
	},
	
	async createProject(projectstr:string){
		try{
			let project:ProjectsAttributes = JSON.parse(projectstr);
			let newProject = await db.Projects.create(project)
			return newProject
		} catch (e){
			throw(e)
		}
	},

	async updateProject(req_user_id:number,req_name:string, projectstr:string){
		try{
			let project:ProjectsAttributes = JSON.parse(projectstr);
			let updatedProject = await db.Projects.update(project, {where: {user_id: req_user_id, name: req_name}})
			return updatedProject
		} catch(e){
			throw e
		}
	},

	async deleteProject(req_user_id:number,req_name:string){
		try{
			let deleteProject = await db.Projects.destroy({where: {user_id: req_user_id, name: req_name}})
			if(deleteProject){
				return true
			}
			else{
				return false
			}
		} catch(e){
			throw e
		}
	}
}