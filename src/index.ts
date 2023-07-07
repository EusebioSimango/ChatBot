import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import 'dotenv/config'
import axios from "axios";
import { RequestBody, WebhookQuery, NewsletterQuery } from './routes'
import { sendTextMessage, sendAudioMessage, sendDocument, sendNewsletter } from './functions/whatsapp'
import { searchVideoOnYoutube, convertYTVideoToAudio } from './functions/youtube'
import { removeCommand } from './functions/functions'

const myToken = process.env.TOKEN;
const PORT = Number(process.env.PORT);

const server = fastify({ logger: false })


server.get('/', async (request: FastifyRequest<{Querystring:WebhookQuery}>, reply: FastifyReply) => {
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
    return { message: 'Hello, World!' }
  }
})

server.post("/", async (request: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
  const body: RequestBody = await request.body;

  if (body?.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const phoneNumberId: string =
        body.entry[0].changes[0].value.metadata.phone_number_id.toString();
      const from: string = body.entry[0].changes[0].value.messages[0].from.toString();
      const name = body.entry[0].changes[0].value.contacts[0].profile?.name;
      const messageBody = body.entry[0].changes[0].value.messages[0].text.body;

      const askDavinci = async (query: string) => {
        axios({
          method: 'POST',
          url: 'https://esimas.onrender.com/davinci',
          params: {name: from, message: query}
        }).then( (response: any) => response.data)
          .then( (data: any) => {
            const answer: string = data.answer
            sendTextMessage(answer, from, phoneNumberId)
          }).catch((error: any) => console.error(error))
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
      else if (messageLower.includes('#tell')) {
        const ref = removeCommand('#tell', messageLower)
        if (ref.startsWith('me')) {
          const msg = ref.replace('me', '')
          sendTextMessage(msg, from, phoneNumberId)
        } else {
          const people = [
            { name: 'shasha ',  id: '258842787852'},
            { name: 'eusebio ', id: '258850143767'},
            { name: 'lenice',   id: '258878130402'}
          ]
          people.forEach( (person: { name: string, id: string}) => {
            if (ref.includes(person.name)) {
              const msg = ref.replace(person.name, '')
              sendTextMessage(msg, person.id, phoneNumberId)
            }
          })
        }
        
      }
      else {
        axios({
          method: 'POST',
          url: 'https://esimas.onrender.com/chat',
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

server.listen({ port: PORT, host: '0.0.0.0' }, (err: any, address?: string) => {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	server.log.info(`Server listening at ${address}`)
})
