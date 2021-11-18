import express from 'express'
import { format } from 'sequelize/types/lib/utils'
import {printRequestRouter} from './printRequest.router'
import {printRequestHistoryRouter} from './printRequestHistory.router'
import {projectRouter} from './project.router'
import {segmentationRouter} from './segmentation.router'
const router = express.Router()


router.use('/printRequests', printRequestRouter)
router.use('/printRequestsHistory', printRequestHistoryRouter)
router.use('/project', projectRouter)
router.use('/segmentation', segmentationRouter)

router.get('/system/check',(req,res)=>{console.log("allo");res.send("allo")})

export {router as routes}