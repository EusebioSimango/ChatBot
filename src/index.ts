import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import 'dotenv/config'
import axios from "axios";
import { RequestBody, WebhookQuery, NewsletterQuery } from './routes'
import { notifyOwner, sendTextMessage, sendAudioMessage, sendDocument } from './fuctions/whatsapp'
import { searchVideoOnYoutube, convertYTVideoToAudio } from './fuctions/youtube'
import { removeCommand } from './fuctions/text'

const myToken = process.env.TOKEN;
type MyRequest = FastifyRequest<{
	Querystring:  {
		msg?: string
	}
}>


const server = fastify({ logger: false })



server.get('/', async (request: MyRequest, reply: FastifyReply) => {
	const { msg } = request.query
	console.log(request.body)
	return { message: msg || 'Hello, World!' }
})

server.get('/webhooks', async (request: FastifyRequest<{Querystring:WebhookQuery}>, reply: FastifyReply) => {
  let mode = request.query["hub.mode"]
  let challenge = request.query["hub.challenge"]
  let token = request.query["hub.verify_token"]
  
  console.log(mode, challenge, ttoken, myToken)
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

      const askDavinci = async (query: string) => {
        axios({
          method: 'POST',
          url: 'https://esimas.up.railway.app/davinci',
          params: {name: from, message: query}
        }).then( (response: any) => response.data)
          .then( (data: any) => {
            const answer: string = data.answer
            sendTextMessage(answer, from, phoneNumberId)
          }).catch((error: any) => console.error(error))
      }

      console.log(`${name} said ${messageBody}`)
      if (from != "258850143767") {
        notifyOwner(messageBody, name, phoneNumberId)
      }
      // ESimas
      const messageLower = messageBody.toLowerCase()
      if (messageLower.includes('#audio')) {
        const query = removeCommand('#audio', messageLower)
        try {
          const { title, url } = await searchVideoOnYoutube(query)
          sendTextMessage(`Wait, downloading ${title}.`, from, phoneNumberId)
          try {
            const audio: string = await convertYTVideoToAudio(url)
            sendAudioMessage(audio, from, phoneNumberId)
          } catch {
            sendTextMessage(`Unavailable.`, from, phoneNumberId)
          }
        } catch {
          sendTextMessage(`Not Founded.`, from, phoneNumberId) 
        }
      }
      else if (messageLower.includes('#doc-audio')) {
        const query = removeCommand('#doc-audio', messageLower)
        try {
          const { title, url } = await searchVideoOnYoutube(query)
          sendTextMessage(`Wait, downloading ${title}.`, from, phoneNumberId)
          try {
            const audio: string = await convertYTVideoToAudio(url)
            sendDocument(audio, title, from, phoneNumberId)
          } catch {
            sendTextMessage(`Unavailable.`, from, phoneNumberId)
          }
        } catch {
          sendTextMessage(`Not Founded.`, from, phoneNumberId) 
        }
      }
      else if (messageLower.includes('#gpt')) {
        const query = removeCommand('#gpt', messageLower)
        askDavinci(query)
      }
      else if (messageLower.includes('#emoji')) {
        const emoji = removeCommand('#emoji', messageLower)
        const query = `O que esse emoji significa ${emoji}?`
        askDavinci(query)
      }
      else if (messageLower.includes('#name')) {
        const name = removeCommand('#name', messageLower)
        const query = `What does the name ${name} means?`
        askDavinci(query)
      }
      else if (messageLower.includes('#nome')) {
        const name = removeCommand('#nome', messageLower)
        const query = `Qual o significado do nome ${name}?`
        askDavinci(query)
      }
      else if (messageLower.includes('#biblia')) {
        const referencia = removeCommand('#biblia', messageLower)
        const query = `Biblia em portugues, ${referencia}, mostre a escritura e a referência.`
        askDavinci(query)
      }
      else {
        axios({
          method: 'POST',
          url: 'https://esimas.up.railway.app/chat',
          params: {name: from, message: messageBody}
        }).then( (response: any) => response.data)
          .then( (data: any) => {
            const answers: string[] = data.answer
            answers.forEach( answer => sendTextMessage(answer, from, phoneNumberId))
          }).catch((error: any) => console.error(error))
      }

      reply.status(200).send();
    } else {
      reply.status(404).send();
    }
  }
});

server.post("/newsletter", (request: FastifyRequest<{ Querystring: NewsletterQuery }>, reply: FastifyReply) => {
  const { from, body: message} = request.query
  if (!(from && message))
    return reply.status(403).send({ message: 'Bad Request'})

  try {
    sendNewsletter(message, from)
    reply.status(201).send({ message: 'Newsletter Sent'})
  } catch {
    reply.status(500).send({ message: 'Internal Server Error'})
  }
})

server.listen({ port: process.env.PORT!, host: '0.0.0.0' }, (err: any, address?: string) => {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	server.log.info(`Server listening at ${address}`)
})
