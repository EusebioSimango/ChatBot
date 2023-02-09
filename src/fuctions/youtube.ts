import YouTube from 'youtube-sr'
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

export const convertYTVideoToAudio = async (url: string) => {
	const response = await axios({
		method: 'GET',
		url: `https://youtube.michaelbelgium.me/api/converter/convert?api_token=${process.env.VIDEO_CONVERTER_API_KEY}&url=${url}`,
	}).catch((err: any) => console.error(err))

	const { file } = response.data
	return file
}