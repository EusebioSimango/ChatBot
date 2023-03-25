import axios from 'axios'
import 'dotenv/config'

const TOKEN = process.env.WA_TOKEN;


export const sendTextMessage = (message: string, to: string, phoneNumberId: string) => {
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v15.0/${phoneNumberId}/messages?access_token=${TOKEN}`,
    data: {
      messaging_product: "whatsapp",
      to,
      text: {
        body: message,
      }, 
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ text sent to', to))
    .catch((err: any) => console.error(err));
}

export const sendAudioMessage = async (link: string, to: string, phoneNumberId: string) => {
	axios({
    method: "POST",
    url: `https://graph.facebook.com/v15.0/${phoneNumberId}/messages?access_token=${TOKEN}`,
    data: {
      messaging_product: "whatsapp",
      to,
      type: "audio",
      audio: {
        link,
      }, 
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ audio sent to', to))
    .catch((err: any) => console.error(err));
}

export const sendImageMessage = async (link: string, caption: string, to: string, phoneNumberId: string) => {
	axios({
    method: "POST",
    url: `https://graph.facebook.com/v15.0/${phoneNumberId}/messages?access_token=${TOKEN}`,
    data: {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: {
        link,
        caption,
      }, 
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ image sent to', to))
    .catch((err: any) => console.error(err));
}

export const sendDocument = (link: string, filename: string, to: string, phoneNumberId: string) => {
	axios({
    method: "POST",
    url: `https://graph.facebook.com/v15.0/${phoneNumberId}/messages?access_token=${TOKEN}`,
    data: {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link,
        filename
      }, 
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ document sent to', to))
    .catch((err: any) => console.error(err));
}


export const notifyOwner = (message: string, name: string, phoneNumberId: string) => {
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v15.0/${phoneNumberId}/messages?access_token=${TOKEN}`,
    data: {
      messaging_product: "whatsapp",
      to: "258850143767",
      text: {
        body: `${name} - ${message}`,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ owner notified!'))
    .catch((err: any) => console.error(err));
}

export const sendNewsletter = (message: string, from: string) => {
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v15.0/105944432315325/messages?access_token=${TOKEN}`,
    data: {
      messaging_product: "whatsapp",
      to: "258850143767",
      text: {
        body: `*${from}*\n\n${message}`,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ Newsletter sent!'))
    .catch(console.error);
}