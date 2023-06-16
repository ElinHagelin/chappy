

const getMessages = async () => {
	try {
		const response = await fetch('/api/messages')
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Get messages failed: ', error.message);
	}
}

const getMessagesWithId = async (userId, userId2) => {
	try {
		const response = await fetch(`/api/messages/${userId}`)
		let data = await response.json()
		if (userId2) {
			data = data.filter(message => message.sender.id === userId2 || message.receiver === userId2)
		}
		return data

	} catch (error) {
		console.log('Get messages with userId failed: '.error.message);
	}
}

const postMessage = async (receiverId, message, user) => {
	try {
		const baseUrl = "/api/messages"
		let userBody = user ? user : { username: 'Anonym', id: 0 }

		const newMessage = {
			sender: userBody,
			receiver: receiverId,
			message: message
		}

		const options = {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newMessage)
		}

		const response = await fetch(baseUrl, options)

	} catch (error) {
		console.log('Post failed: ', error.message);
	}
}

const editMessage = async (messageId, newMessage) => {
	try {
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

	} catch (error) {
		console.log('Edit failed: ', error.message);
	}
}

const deleteMessage = async (messageId) => {
	try {
		const deleteUrl = `/api/messages/${messageId}`

		const options = {
			method: "DELETE",
		}
		const response = await fetch(deleteUrl, options)

	} catch (error) {
		console.log("Delete failed: ", response)
	}
}


export { getMessagesWithId, postMessage, editMessage, deleteMessage }