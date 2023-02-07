import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import 'dotenv/config'
import axios from "axios";
import { RequestBody } from './routes'

const token = process.env.TOKEN;
const myToken = process.env.TOKEN;
type MyRequest = FastifyRequest<{
	Querystring:  {
		msg?: string
	}
}>
interface WebhookQuery {
	'hub.mode'?: string | number,
	'hub.challenge'?: string | number,
	'hub.verify_token'?: string | number
}


const server = fastify({ logger: true })

const sendMessageToWhatsApp = (message: string, to: string, phoneNumberId: string, token: string) => {
  console.log(message, to, phoneNumberId, token)
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
    data: {
      messaging_product: "whatsapp",
      to: to,
      text: {
        body: message,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('message sent!'))
    .catch((err: any) => console.error(err));
}

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
  console.log("when I send a msg it gets to post", request.body)

  console.log("The Body: " + JSON.stringify(body, null, 2));

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
      const name = body.entry[0].changes[0].value.profile?.name;
      const messageBody = body.entry[0].changes[0].value.messages[0].text.body;

      // ESimas

      console.log(`${ (name) ? name : from} said ${messageBody}`);
      axios({
        method: 'POST',
        url: 'https://esimas.up.railway.app/chat',
        params: {name: `${(name) ? name : from}`, message: messageBody}
      }).then( (response: any) => response.data)
        .then( (data: any) => {
          const answers: string[] = data.answer
          answers.forEach( answer => sendMessageToWhatsApp(answer, from, phoneNumberId, token))
        }).catch((error: any) => console.error(error))

      

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
