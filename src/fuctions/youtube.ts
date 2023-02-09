import { search } from "yt-search"
import axios from 'axios'
import 'dotenv/config'

function generateOptions(query: string) {
	return {
		query,
		pageStart: 1,
		pageEnd: 1
	}
}

function getFirstValidVideo(videos: any) {
	return videos[0].seconds <= 900 
		? videos[0]
		: getFirstValidVideo(videos.slice(1))
}

export const searchVideoOnYoutube = async (keyword: string) => {
	const options = generateOptions(keyword)

	const { videos } = await search(options)
	const { title, seconds: timeInSeconds, videoId, url } = await getFirstValidVideo(videos)

	return {
		title,
		timeInSeconds,
		videoId,
		url
	}
}

export const convertYTVideoToAudio = async (url: string) => {
	const response = await axios({
		method: 'GET',
		url: `https://youtube.michaelbelgium.me/api/converter/convert?api_token=${process.env.VIDEO_CONVERTER_API_KEY}&url=${url}`,
	}).catch((err: any) => console.error(err))

	const { file } = response.data
	return file
}

// async function __main__ () {
// 	const file = await convertYTVideoToAudio('https://youtube.com/watch?v=sETfYW1wJ9w')
// 	console.log(file)
// }
// __main__()