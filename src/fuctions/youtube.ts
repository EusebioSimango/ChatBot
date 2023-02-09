import youtubeSearch from 'youtube-search'
import axios from 'axios'
import 'dotenv/config'


// function getFirstValidVideo(videos: any) {
// 	return videos[0].seconds <= 900 
// 		? videos[0]
// 		: getFirstValidVideo(videos.slice(1))
// }

export const searchVideoOnYoutube = async (keyword: string) => {
	const options: youtubeSearch.YouTubeSearchOptions = {
		maxResults: 10,
		key: process.env.YOUTUBE_API_V3_KEY
	}

	youtubeSearch(keyword, options, (err: any, results: any) => {
	  if(err) return console.log(err);

	  console.dir(results[0]);
	});

	// return {
	// 	title,
	// 	timeInSeconds,
	// 	videoId,
	// 	url
	// }
}

// export const convertYTVideoToAudio = async (url: string) => {
// 	const response = await axios({
// 		method: 'GET',
// 		url: `https://youtube.michaelbelgium.me/api/converter/convert?api_token=${process.env.VIDEO_CONVERTER_API_KEY}&url=${url}`,
// 	}).catch((err: any) => console.error(err))

// 	const { file } = response.data
// 	return file
// }

async function __main__ () {
	// const file = await convertYTVideoToAudio('https://youtube.com/watch?v=sETfYW1wJ9w')
	// console.log(file)
	searchVideoOnYoutube('ugly crier')
}
__main__()