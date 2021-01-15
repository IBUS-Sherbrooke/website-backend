import express from 'express'
import { format } from 'sequelize/types/lib/utils'
import {printRequestRouter} from './printRequest.router'
const router = express.Router()


router.use('/printRequests', printRequestRouter)

export {router as routes}