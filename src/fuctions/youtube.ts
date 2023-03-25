import YouTube from 'youtube-sr'
import ytdl from 'ytdl-core'
import axios from 'axios'
import 'dotenv/config'


function getFirstValidVideo(videos: any) {
	return videos[0].duration <= 900000
		? videos[0]
		: getFirstValidVideo(videos.slice(1))
}

export const searchVideoOnYoutube = async (keyword: string) => {
	const options = {
		limit: 10,
		safeSearch: true
	}

	const videos = await YouTube.search(keyword, options)
	 	.catch(console.error)

	const { title, id, duration: durationInMs } = getFirstValidVideo(videos)

	return {
		title,
		url: `https://youtube.com/watch?v=${id}`
	}
}

const getAvailableFormat = (formats) => {
	const firstTry = formats.filter(format => format.qualityLabel == '480p')
	if (firstTry) 
		return firstTry
	console.log(`480p didn't work trying another`)
}

export const convertYTVideoToMp4 = async (url: string) => {
	console.log('trying to convert')
	const { formats } = await ytdl.getInfo(url)
	const validFormats = formats.filter(format => format.mimeType.includes('mp4'))
	// validFormats.forEach(format => {
	//  	console.log(format.mimeType, '-' ,format.qualityLabel)
	// })
	const format = getAvailableFormat(validFormats)
	const { url } = format[0]

	return url
}

export const convertYTVideoToAudio = async (url: string) => {
	const response = await axios({
		method: 'GET',
		url: `https://youtube.michaelbelgium.me/api/converter/convert?api_token=${process.env.VIDEO_CONVERTER_API_KEY}&url=${url}`,
	}).catch((err: any) => console.error(err))

	const { file } = response.data
	return file
}

async function __main__ () {

	convertYTVideoToMp4('https://youtube.com/watch?v=RCUW9Z3rCKE')
	.catch(err => console.error(err))
}

__main__()