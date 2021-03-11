import { expression } from "joi"
import fs from 'fs'
import path from 'path'
import {projectCreate, projectUpdateBody, projectUpdateQuery} from '../validators/projectValidator'
import {projectService} from '../services/project.service'
import {responseMessage} from './responses'

export const projectController  = {
 
    /* get All projects */
    async getProjects(req:any, res:any) {
        try {
            let projects = await projectService.getProjects()
            let msg:responseMessage = {data: projects, message: "getProjects success!"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)

            let msg:responseMessage = {data: e, message: "getProjects Failed"}
            res.status(400).json(msg)
        }
    },

    /* get All projects MOCK (to delete) */
    async getProjectsMock(req:any, res:any) {
        try {
            let projects = await projectService.getProjectsMock()
            res.send(projects)

            let msg:responseMessage = {data: projects, message: "getProjects success!"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)

            let msg:responseMessage = {data: e, message: "getProjects Failed"}
            res.status(400).json(msg)
        }
    },
 
    /* add project */
    async addProject(req:any, res:any) {
        try {
            const body:string = JSON.stringify(req.body)
            /* validate input */
            let inputIsValid = await projectCreate.validate(req.body)
 
            if(inputIsValid.error){
                let msg:responseMessage = {data: inputIsValid.error.details[0].message, message: "addProject Failed"}
                res.status(400).json(msg)
            } else {
                let createdProject = await projectService.createProject(body)
                let project_dir:string = path.join(__dirname, '../uploads', req.body.user_id.toString(), req.body.name)
                fs.mkdirSync(project_dir, { recursive: true })

                let msg:responseMessage = {data: createdProject, message: "addProject Success!"}
                res.status(200).json(msg)
            }
        } catch (e) {
            console.log(e)

            let msg:responseMessage = {data: e, message: "addProject Failed"}
            res.status(400).json(msg)
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
                    let msg:responseMessage = {data: bodyIsValid.error.details[0].message, message: "updateProject Failed: body invalid"}
                    res.status(400).json(msg)
                } else if(queryIsValid.error){
                    let msg:responseMessage = {data: queryIsValid.error.details[0].message, message: "updateProject Failed: query invalid"}
                    res.status(400).json(msg)
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
                let msg:responseMessage = {data: updateProject, message: "updateProject Success!"}
                res.status(200).json(msg)
            }
        } catch (e) {
            console.log(e)
            let msg:responseMessage = {data: e, message: "updateProject failed"}
            res.status(400).json(msg)
        }
    },

    async deleteProjectByName(req:any, res:any) {
        try {
            const user_id:number = req.query.user_id
            const name:string = req.query.name
            let queryIsValid = await projectUpdateQuery.validate(req.query)

            if(queryIsValid.error){
                let msg:responseMessage = {data: queryIsValid.error.details[0].message, message: "deleteProject failed: query invalid"}
                res.status(400).json(msg)
                return
            }

            /*remove dir and db entry */
            let deleteProject = await projectService.deleteProject(user_id, name)
            let project_dir:string = path.join(__dirname, '../uploads', req.body.user_id, req.body.name)
            fs.rmSync(project_dir)

            let msg:responseMessage = {data: deleteProject, message: "deleteProject failed: query invalid"}
            res.status(200).json(msg)
        } catch (e) {
            console.log(e)
            let msg:responseMessage = {data: e, message: "deleteProject failed"}
            res.status(400).json(msg)
            res.send(`deleteProject Failed : ${e}`)
        }
    }
}