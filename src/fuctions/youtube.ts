import { search } from "yt-search"

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