import express from 'express';
import { expression } from 'joi';
import {projectController} from '../controllers/project.controller';

const projectRouter = express.Router()


projectRouter.get('/',projectController.getProjects)
projectRouter.post('/',express.json(), projectController.addProject)
projectRouter.put('/', express.json(),projectController.updateProjectByName)
projectRouter.delete('/',projectController.deleteProjectByName)



//fake request for testing
projectRouter.get('/mock',projectController.getProjectsMock)

export {projectRouter}