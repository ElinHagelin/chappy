

const getMessages = async () => {
	const response = await fetch('/api/messages')
	const data = await response.json()
	return data
}

export { getMessages }