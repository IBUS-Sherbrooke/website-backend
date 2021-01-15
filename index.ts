import express from 'express'
import {routes} from './routes/index'
import {config} from './configs/config'

const app = express()

app.use(express.json())
app.use('/api',routes)

app.listen(config.web.port,()=>{
	console.log(`server running at port ${config.web.port}`)
})
