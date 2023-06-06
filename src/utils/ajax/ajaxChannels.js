

const getChannels = async () => {
	const response = await fetch('/api/channels')
	const data = await response.json()
	return data
}

export { getChannels }