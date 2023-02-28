import { Router } from "express";
import axios from "axios";

// const token = process.env.TOKEN;
// const myToken = process.env.MY_TOKEN;

export interface RequestBody {
  object?: string;
  entry?: [
    {
      id: string;
      changes: [
        {
          value: {
            messaging_product: string;
            metadata: {
              display_phone_number: number;
              phone_number_id: number;
            };
            contacts: [
              {
                profile: {
                  name: string;
                };
                wa_id: number;
              }
            ];
            messages: [
              {
                from: number;
                id: string;
                timestamp: number;
                text: {
                  body: string;
                };
                type: string;
              }
            ];
          };
          field: string;
        }
      ];
    }
  ];
}

export interface WebhookQuery {
  'hub.mode'?: string | number,
  'hub.challenge'?: string | number,
  'hub.verify_token'?: string | number
}

export interface NewsletterQuery{
  from: string,
  body: string
}


// routes.post("/webhooks", async (request, response) => {
//   const body: RequestBody = await request.body;
//   console.log("when I send a msg it gets to post", request.body)

//   console.log("The Body: " + JSON.stringify(body, null, 2));

//   if (body?.object) {
//     if (
//       body.entry &&
//       body.entry[0].changes &&
//       body.entry[0].changes[0].value.messages &&
//       body.entry[0].changes[0].value.messages[0]
//     ) {
//       const phoneNumberId =
//         body.entry[0].changes[0].value.metadata.phone_number_id;
//       const from = body.entry[0].changes[0].value.messages[0].from;
//       const messageBody = body.entry[0].changes[0].value.messages[0].text.body;

//       console.log(`${from} said ${messageBody}`);

//       if (messageBody.startsWith("#time")) {
//         const region = messageBody.substring(5).trim();
//         const datetime = getTimeZone(region);

//         axios({
//           method: "POST",
//           url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
//           data: {
//             messaging_product: "whatsapp",
//             to: from,
//             text: {
//               body: `${datetime}`,
//             },
//           },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//       } else if (messageBody.startsWith("#calc")) {
//         const expression = messageBody.substring(5).trim();
//         const result = eval(expression)

//         axios({
//           method: "POST",
//           url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
//           data: {
//             messaging_product: "whatsapp",
//             to: from,
//             text: {
//               body: `${expression} = ${result}`,
//             },
//           },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//       } else {
//         axios({
//           method: "POST",
//           url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
//           data: {
//             messaging_product: "whatsapp",
//             to: from,
//             text: {
//               body: "Hi.. I'm ESimas Bot",
//             },
//           },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//       }

//       response.sendStatus(200);
//     } else {
//       response.sendStatus(404);
//     }
//   }
// });
