

const getMessages = async () => {
	const response = await fetch('/api/messages')
	const data = await response.json()
	return data
}

const getMessagesWithId = async (userId, userId2) => {
	const response = await fetch(`/api/messages/${userId}`)
	let data = await response.json()
	if (userId2) {
		data = data.filter(message => message.sender === userId2 || message.receiver === userId2)
	}
	return data
}

const postMessage = async (receiverId, message, userId) => {

	const baseUrl = "/api/messages"

	let user = userId ? userId : 0

	const newMessage = {
		sender: user,
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

const editMessage = async (messageId, newMessage) => {
	const url = `/api/messages/${messageId}`

	let allMessages = await getMessages()
	const targetMessage = allMessages.find(message => message.id === messageId)

	targetMessage.message = newMessage
	const body = targetMessage

	const options = {
		method: 'PUT',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	}

	let response = await fetch(url, options)
	console.log(response)
}

const deleteMessage = async (messageId) => {
	const deleteUrl = `/api/messages/${messageId}`

	const options = {
		method: "DELETE",
	}

	try {
		const response = await fetch(deleteUrl, options)
		console.log("success")
		return true

	} catch (error) {
		console.log("Delete status failed: ", response)
		return false
	}
}


export { getMessagesWithId, postMessage, editMessage, deleteMessage }