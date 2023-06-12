

// const getMessages = async () => {
// 	const response = await fetch('/api/messages')
// 	const data = await response.json()
// 	return data
// }

const getMessagesWithId = async (userId, userId2) => {
	const response = await fetch(`/api/messages/${userId}`)
	let data = await response.json()
	if (userId2) {
		data = data.filter(message => message.sender === userId2 || message.receiver === userId2)
	}
	return data
}

const postMessage = async (userId, receiverId, message) => {

	const baseUrl = "/api/messages"

	const newMessage = {
		sender: userId,
		receiver: receiverId,
		message: message
	}

	const options = {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newMessage)
	}

	const response = await fetch(baseUrl, options)
}


export { getMessagesWithId, postMessage }