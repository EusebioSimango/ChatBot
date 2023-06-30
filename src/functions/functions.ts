export const removeCommand = (command: string, text: string) => {
	const _ = command + ' '
	return text.replace(_, '')
}