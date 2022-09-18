import axios from 'axios'

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }



const dateAndTime = (location: string): string => {
	axios({
		method: "GET",
		url: `http://worldtimeapi.org/api/timezone/${location}`
	}).then((response) => response.data)
		.then(data => {
			const timezoneInfo = data
			const { datetime } = timezoneInfo
			const datetimeFormatted = datetime.toLocaleDateString("en-US", options)
			return datetimeFormatted
 		})
}

export const getTimeZone = (region: string): string => {
	axios({
		method: "GET",
		url: "http://worldtimeapi.org/api/timezone"
	}).then((response) => response.data)
		.then(data => {
			const listOfTimeZones = data
			const timezone = listOfTimeZones.filter(timezone => timezone.includes(region))[0]
			return dateAndTime(timezone)
 		})
}

getTimeZone('Maputo')


