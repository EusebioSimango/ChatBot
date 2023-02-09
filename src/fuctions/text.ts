export const removeCommand = (command: string, text: string) => {
	return text.replace(command, '')
}