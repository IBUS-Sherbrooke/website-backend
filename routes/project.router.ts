import express from 'express';
import {projectController} from '../controllers/project.controller';

const projectRouter = express.Router()


projectRouter.get('/',projectController.getProjects)
projectRouter.post('/', projectController.addProject)
projectRouter.put('/', projectController.updateProjectByName)
projectRouter.delete('/',projectController.deleteProjectByName)



//fake request for testing
projectRouter.get('/mock',projectController.getProjectsMock)

export {projectRouter}