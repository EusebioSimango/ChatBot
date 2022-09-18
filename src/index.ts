import * as express from "express";
import * as bodyParser from "body-parser";
import "dotenv/config";
import { routes } from "./routes";

const myToken = process.env.MY_TOKEN;
const PORT = process.env.PORT;

const app = express();
app.use(routes);
app.use(bodyParser.json());

app.get("/webhooks", (request, response) => {
  let mode = request.query["hub.mode"];
  let challenge = request.query["hub.challenge"];
  let token = request.query["hub.verify_token"];

  console.log(mode, challenge, token);

  if (mode && token) {
    if (mode == "subscribe" && token == myToken) {
      response.status(200).send(challenge);
    } else {
      response.sendStatus(403);
    }
  }

  return response.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(">_ Webhook started, listening on port: " + PORT);
});
