import express from 'express'
import { format } from 'sequelize/types/lib/utils'
import {printRequestRouter} from './printRequest.router'
import {printRequestHistoryRouter} from './printRequestHistory.router'
const router = express.Router()


router.use('/printRequests', printRequestRouter)
router.use('/printRequestsHistory', printRequestHistoryRouter)

export {router as routes}