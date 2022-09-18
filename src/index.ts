import express from 'express'
import bodyParser from 'body-parser'
import "dotenv/config"

var test = process.env.MY_TOKEN
console.log(test)

const app = express()
app.use(bodyParser.json())

app.get('/', (request, response) => {
	return response.status(200).send("Hello, World!")
})

app.get('/webhooks', (request, response) => {
	let mode = request.query["hub.mode"]
	let challenge = request.query["hub.challenge"]
	let token = request.query["hub.verify_token"]
	const myToken = process.env.MY_TOKEN

	if (mode && token) {
		if(mode == "subscribe" && token == myToken) {
			response.status(200).send(challenge)
		} else {
			response.status(403)
		}
	}
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


		}
	}
})


app.listen(3333, () => {
	console.log(">_ Server started")
})