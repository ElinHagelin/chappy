import { useRecoilState } from "recoil"
import selectedChatIdAtom from "../recoil/selectedChatIdAtom.js"
import { getChannels } from "../utils/ajax/ajaxChannels.js"
import { getMessagesWithId, postMessage, editMessage, deleteMessage } from "../utils/ajax/ajaxMessages.js"
import { useEffect, useState } from "react"
import selectedChatMessagesAtom from "../recoil/selectedChatMessagesAtom.js"
import { getUserName } from "./Header.jsx"
import loggedInAtom from "../recoil/loggedInAtom.js"


const Chat = () => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)
	const [selectedChatName, setSelectedChatName] = useState('')
	const [message, setMessage] = useState('')
	const [editMode, setEditMode] = useState(null)
	const [newMessage, setNewMessage] = useState('')


	async function getChatName() {
		let channels = await getChannels()
		let isDM = null
		if (isLoggedIn.id) {
			let DMs = await getMessagesWithId(isLoggedIn.id)
			isDM = DMs.filter(message => (message.sender === selectedChatId) || (message.receiver === selectedChatId))
		}
		let isChannel = channels.find(channel => channel.id === selectedChatId)
		if (isChannel) {
			setSelectedChatName(isChannel.name)
		} else if (isDM) {
			let username = await getUserName(selectedChatId)
			setSelectedChatName(username)
		}
	}

	const handleEdit = async (messageId) => {
		setEditMode(messageId)
	}

	const handleSave = async (messageId) => {
		if (newMessage !== '') {
			setEditMode(null)
			await editMessage(messageId, newMessage)
			let messages = await fetchMessages()
			setChatMessages(messages)
			setNewMessage('')
		}
	}

	const handleDelete = (messageId) => {
		deleteMessage(messageId)
		setChatMessages((prevMessages) =>
			prevMessages.filter((message) => message.id !== messageId)
		);
	}

	const handleSubmit = async () => {
		if (message === '') {
			return false
		}
		if (isLoggedIn !== null) {
			await postMessage(selectedChatId, message, isLoggedIn)
		} else {
			await postMessage(selectedChatId, message)
		}
		setMessage('')
		let messages = await fetchMessages()
		setChatMessages(messages)
	}

	useEffect(() => {
		getChatName()
	}, [selectedChatId])

	const fetchMessages = async () => {
		let messages = []
		if (selectedChatId > 1000) {
			messages = await getMessagesWithId(selectedChatId)
		} else {
			messages = await getMessagesWithId(selectedChatId, isLoggedIn.id)
		}
		return messages
	}


	return (
		<div className="chat-area">
			{selectedChatId ? (
				<>
					<section className="heading">
						Chattar i <span className="chat-name"> #{selectedChatName} </span>
					</section>
					<section className="history">

						{chatMessages !== [] ?
							chatMessages.map(message => (
								<section key={message.id} className={message.sender.id === isLoggedIn.id ? 'align-right' : null}>
									<p> {message.sender.username}:
										{editMode === message.id ? (<input type="text"
											onChange={(e) => setNewMessage(e.target.value)}
											value={newMessage} onBlur={() => setEditMode(false)}></input>)
											: message.message} </p>
									<p> {message.time} </p>
									{message.sender.id === isLoggedIn.id && (
										<>
											{editMode === message.id ? <button onClick={() => handleSave(message.id)}> Spara </button> : <button onClick={() => handleEdit(message.id)}> Redigera </button>}
											<button onClick={() => handleDelete(message.id)}> Ta bort </button>
										</>
									)}
								</section>
							))

							: <p>Här var det tomt, skicka ett meddelande för att börja chatta...</p>
						}

					</section>
					<section>
						<input type="text" placeholder="Ditt meddelande..." value={message} onChange={(e) => setMessage(e.target.value)} />
						<button onClick={async () => await handleSubmit()}> Skicka </button>
					</section>
				</>
			)
				: <section className="heading">
					Välj en kanal för att börja chatta
				</section>}
		</div>
	)
}

export default Chat