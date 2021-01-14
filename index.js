const express = require('express')
const routes = require('./routes/index')
const config = require('./configs/config')

const app = express()

app.use(express.json())
app.use('/api',routes)

app.listen(config.web.port,()=>{
	console.log(`server running at port ${config.web.port}`)
})
