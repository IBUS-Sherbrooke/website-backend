import { expression } from "joi"
import fs from 'fs'
import path from 'path'
import {projectCreate, projectUpdateBody, projectUpdateQuery} from '../validators/projectValidator'
import {projectService} from '../services/project.service'


export const projectController  = {
 
    /* get All projects */
    async getProjects(req:any, res:any) {
        try {
            let projects = await projectService.getProjects()
            res.send(projects)
        } catch (e) {
            console.log(e)
            res.send(`getProjects Failed : ${e}`)
        }
    },

    /* get All projects MOCK (to delete) */
    async getProjectsMock(req:any, res:any) {
        try {
            let projects = await projectService.getProjectsMock()
            res.send(projects)
        } catch (e) {
            console.log(e)
            res.send(`getProjects Failed : ${e}`)
        }
    },
 
    /* add project */
    async addProject(req:any, res:any) {
        try {
            const body:string = JSON.stringify(req.body)
            /* validate input */
            let inputIsValid = await projectCreate.validate(req.body)
 
            if(inputIsValid.error){
                res.send(inputIsValid.error.details[0].message)
            } else {
                let createdProject = await projectService.createProject(body)
                let project_dir:string = path.join(__dirname, '../uploads', req.body.user_id.toString(), req.body.name)
                fs.mkdirSync(project_dir, { recursive: true })
                res.send(createdProject)
            }
        } catch (e) {
            console.log(e)
            res.send(`addProjects Failed : ${e}`)
        }
    },
 
    async updateProjectByName(req:any, res:any) {
        try {
            const body:string = JSON.stringify(req.body)
            const user_id:number = req.query.user_id
            const name:string = req.query.name
            /* validate input */
            let bodyIsValid = await projectUpdateBody.validate(req.body)
            let queryIsValid = await projectUpdateQuery.validate(req.query)

            if(bodyIsValid.error || queryIsValid.error){
                if(bodyIsValid.error){
                    res.send("body: " + bodyIsValid.error.details[0].message)
                } else if(queryIsValid.error){
                    res.send("param: " + queryIsValid.error.details[0].message)
                }
            } else {
                /*Calling the service*/
                let updateProject = await projectService.updateProject(user_id, name, body)

                /*rename dir if name changes */
                if(req.body.name){
                    let project_dir_parent:string = path.join(__dirname, '../uploads', user_id.toString())
                    let project_dir_old:string = path.join(project_dir_parent, name)
                    let project_dir_new:string = path.join(project_dir_parent, req.body.name)
                    fs.renameSync(project_dir_old, project_dir_new)
                }
                res.send(updateProject)
            }
        } catch (e) {
            console.log(e)
            res.send(`updateProject Failed : ${e}`)
        }
    },

    async deleteProjectByName(req:any, res:any) {
        try {
            const user_id:number = req.query.user_id
            const name:string = req.query.name
            let queryIsValid = await projectUpdateQuery.validate(req.query)

            if(queryIsValid.error){
                res.send("query: " + queryIsValid.error.details[0].message)
                return
            }

            /*remove dir and db entry */
            let deleteProject = await projectService.deleteProject(user_id, name)
            let project_dir:string = path.join(__dirname, '../uploads', req.body.user_id, req.body.name)
            fs.rmSync(project_dir)
            
            res.send(deleteProject)
        } catch (e) {
            console.log(e)
            res.send(`deleteProject Failed : ${e}`)
        }
    }
}