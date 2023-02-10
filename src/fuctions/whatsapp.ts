import axios from 'axios'


export const sendTextMessage = (message: string, to: string, phoneNumberId: string, token: string) => {
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
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

export const sendAudioMessage = async (link: string, to: string, phoneNumberId: string, token: string) => {
	axios({
    method: "POST",
    url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
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

export const sendImageMessage = async (link: string, caption: string, to: string, phoneNumberId: string, token: string) => {
	axios({
    method: "POST",
    url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
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

export const sendDocument = (link: string, caption: string, from: string, phoneNumberId: string, token: string) => {
	axios({
    method: "POST",
    url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
    data: {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link,
        caption,
        filename: caption
      }, 
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response: any) => console.log('>_ document sent to', to))
    .catch((err: any) => console.error(err));
}


export const notifyOwner = (message: string, name: string, phoneNumberId: string, token: string) => {
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v14.0/${phoneNumberId}/messages?access_token=${token}`,
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