import * as express from 'express'
import * as bodyParser from 'body-parser'
import 'dotenv/config'
import { routes } from './routes'

const PORT = process.env.PORT


const app = express()
app.use(routes)
app.use(bodyParser.json())


app.listen(PORT, () => {
	console.log(">_ Webhook started, listening on port: "+PORT)
})