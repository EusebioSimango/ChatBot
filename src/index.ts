import express from 'express'

const app = express()

app.get('/', (request, response) => {
	return response.status(200).send("Hello, World!")
})

app.listen(3333, () => {
	console.log(">_ Server started")
})