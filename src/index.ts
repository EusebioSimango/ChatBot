import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import 'dotenv/config'
import axios from "axios";
import { RequestBody, WebhookQuery } from './routes'
import { notifyOwner, sendTextMessage, sendAudioMessage } from './fuctions/whatsapp'
import { searchVideoOnYoutube } from './fuctions/youtube'
import { removeCommand } from './fuctions/text'

const token = process.env.TOKEN;
const myToken = process.env.TOKEN;
type MyRequest = FastifyRequest<{
	Querystring:  {
		msg?: string
	}
}>


const server = fastify({ logger: true })



server.get('/', async (request: MyRequest, reply: FastifyReply) => {
	const { msg } = request.query
	console.log(request.body)
	return { message: msg || 'Hello, World!' }
})

server.get('/webhooks', async (request: FastifyRequest<{Querystring:WebhookQuery}>, reply: FastifyReply) => {
  let mode = request.query["hub.mode"]
  let challenge = request.query["hub.challenge"]
  let token = request.query["hub.verify_token"]
  
  console.log(mode, challenge, token, myToken)
  if (mode && token) {
    if(mode == "subscribe" && token == myToken) {
      reply.status(200).send(challenge)
    } else {
      reply.status(403).send("403")
    }
  } else {
    reply.status(403).send("403")
  }
})

server.post("/webhooks", async (request: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
  const body: RequestBody = await request.body;

  if (body?.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const phoneNumberId =
        body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = body.entry[0].changes[0].value.messages[0].from;
      const name = body.entry[0].changes[0].value.contacts[0].profile?.name;
      const messageBody = body.entry[0].changes[0].value.messages[0].text.body;

      console.log(`${name} said ${messageBody}`)
      if (from != "258850143767") {
        notifyOwner(messageBody, name, phoneNumberId, token)
      }
      // ESimas
      const messageLower = messageBody.toLowerCase()
      if (messageLower.includes('#audio')) {
        const query = removeCommand('#audio', messageLower)
        const { title, timeInSeconds, videoId, url } = await searchVideoOnYoutube(query)
          .catch( () => sendTextMessage(`Not Founded.`, from, phoneNumberId, token))

        sendTextMessage(`Wait, downloading ${title}.`, from, phoneNumberId, token)
        const audio: string = await convertYTVideoToAudio(url)
          .catch( () => sendTextMessage(`Unavailable.`, from, phoneNumberId, token))

        sendAudioMessage(audio, from, phoneNumberId, token)

      }
      else if (messageLower.includes('#gpt')) {
        const query = removeCommand('#gpt', messageLower)
        axios({
          method: 'POST',
          url: 'https://esimas.up.railway.app/davinci',
          params: {name: from, message: query}
        }).then( (response: any) => response.data)
          .then( (data: any) => {
            const answer: string = data.answer
            sendTextMessage(answer, from, phoneNumberId, token)
          }).catch((error: any) => console.error(error))
      }
      else {
        axios({
          method: 'POST',
          url: 'https://esimas.up.railway.app/chat',
          params: {name: from, message: messageBody}
        }).then( (response: any) => response.data)
          .then( (data: any) => {
            const answers: string[] = data.answer
            answers.forEach( answer => sendTextMessage(answer, from, phoneNumberId, token))
          }).catch((error: any) => console.error(error))
      }

      reply.status(200).send();
    } else {
      reply.status(404).send();
    }
  }
});

server.listen({ port: process.env.PORT!, host: '0.0.0.0' }, (err: any, address?: string) => {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	server.log.info(`Server listening at ${address}`)
})
