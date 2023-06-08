

// const getMessages = async () => {
// 	const response = await fetch('/api/messages')
// 	const data = await response.json()
// 	return data
// }

const getMessagesWithId = async (userId) => {
	const response = await fetch(`/api/messages/${userId}`)
	const data = await response.json()
	return data
}

export { getMessagesWithId }