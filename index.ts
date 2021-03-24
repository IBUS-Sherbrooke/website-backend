import express from 'express'
import {routes} from './routes/index'
import {config} from './configs/config'
import {Worker} from 'worker_threads'

var cors = require('cors')
const app = express()

app.use(cors(
	{
	origin: 'http://localhost:4200'
	}
));
app.use('/api',routes)

app.listen(config.web.port,()=>{
	console.log(`server running at port ${config.web.port}`)
})

const worker = new Worker('./services/printWorker.js');