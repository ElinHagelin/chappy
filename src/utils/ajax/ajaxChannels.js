

const getChannels = async () => {
	try {
		const response = await fetch('/api/channels')
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Get channels failed: ', error.message);
	}
}

export { getChannels }