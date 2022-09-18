import { Router } from 'express'
import axios from 'axios'
import { getTimeZone } from './dateAndTime'


const token = process.env.TOKEN
const myToken = process.env.MY_TOKEN

export const routes = Router() // start routes

routes.get('/', (request, response) => {
	return response.status(200).send("Hello, World!")
})

routes.get('/webhooks', (request, response) => {
	let mode = request.query["hub.mode"]
	let challenge = request.query["hub.challenge"]
	let token = request.query["hub.verify_token"]

	console.log(mode, challenge, token)

	if (mode && token) {
		if(mode == "subscribe" && token == myToken) {
			response.status(200).send(challenge)
		} else {
			response.sendStatus(403)
		}
	}

	return response.send("Hello World!")
})

routes.post('/webhooks', (request, response) => {
	const { body } =  request


	console.log('The Body: ' + JSON.stringify(body, null, 2))

	if (body.object){
		if (body.entry && 
			body.entry[0].changes && 
			body.entry[0].changes[0].value.messages &&
			body.entry[0].changes[0].value.messages[0] 
		){
			const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id
			const from = body.entry[0].changes[0].value.messages[0].from
			const messageBody = body.entry[0].changes[0].value.messages[0].text.body

			console.log(`${from} said ${messageBody}`)
			if (messageBody.startsWith('#time')) {
				const region = messageBody.substring(5).trim()
				const datetime = getTimeZone(region)

				axios({
					method: "POST",
					url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
					data: {
						messaging_product: "whatsapp",
						to: from,
						text: {
							body: `${datetime.toString()}`,
						}
					},
					headers: {
						'Content-Type': 'application/json'
					}
				})
			} else {
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
			}

			response.sendStatus(200)
		} else {
			response.sendStatus(404)
		}
	}
})