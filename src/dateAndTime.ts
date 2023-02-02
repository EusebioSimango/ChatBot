// import axios from "axios";
// import { format, parseISO } from 'date-fns'

// const options: any = {
//   weekday: "long",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

// interface WorldTimeAPIResponse {
//   datetime: string;
// }

// const dateAndTime = (location: string): string => {
//   let datetimeFormatted;
//   axios({
//     method: "GET",
//     url: `http://worldtimeapi.org/api/timezone/${location}`,
//   })
//     .then((response) => response.data)
//     .then((data) => {
//       const timezoneInfo: WorldTimeAPIResponse = data;
//       const { datetime } = timezoneInfo;
//       console.log(typeof datetime, typeof parseISO(datetime))
//       datetimeFormatted = format(parseISO(datetime), 'yyyy-MM-dd')
//     });
//   return datetimeFormatted;
// };

// export const getTimeZone = (region: string): string => {
// 	let dateTime: string
//   axios({
//     method: "GET",
//     url: "http://worldtimeapi.org/api/timezone",
//   })
//     .then((response) => response.data)
//     .then((data) => {
//       const listOfTimeZones: string[] = data;
//       const timezone = listOfTimeZones.filter((timezone) =>
//         timezone.includes(region)
//       )[0];
//       dateTime = dateAndTime(timezone);
//     });
// 	return dateTime
// };
