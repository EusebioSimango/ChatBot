import * as express from 'express'
import * as bodyParser from 'body-parser'
import axios from 'axios'
import 'dotenv/config'

// var test = process.env.MY_TOKEN
// console.log(test)
const PORT = process.env.PORT
const token = process.env.TOKEN
const myToken = process.env.MY_TOKEN


const app = express()
app.use(bodyParser.json())

app.get('/', (request, response) => {
	return response.status(200).send("Hello, World!")
})

app.get('/webhooks', (request, response) => {
	let mode = request.query["hub.mode"]
	let challenge = request.query["hub.challenge"]
	let token = request.query["hub.verify_token"]

	if (mode && token) {
		if(mode == "subscribe" && token == myToken) {
			response.status(200).send(challenge)
		} else {
			response.sendStatus(403)
		}
	}

	return response.send("HelloWorld!")
})

app.post('/webhooks', (request, response) => {
	let { body } = request

	console.log(JSON.stringify(body, null, 2))

	if (body.object){
		if (body.entry && 
			body.entry[0].changes && 
			body.entry[0].changes[0].value.messages &&
			body.entry[0].changes[0].value.messages[0] 
		){
			const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id
			const from = body.entry[0].changes[0].value.messages[0].from
			const messageBody = body.entry[0].changes[0].value.messages[0].text.body

			axios({
				method: "POST",
				url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
				data: {
					messaging_product: "whatsapp",
					to: from,
					text: {
						body: "Hi.. I'm ESimas Bot",
					}
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})

			response.sendStatus(200)
		} else {
			response.sendStatus(404)
		}
	}
})


app.listen(PORT, () => {
	console.log(">_ Server started")
})