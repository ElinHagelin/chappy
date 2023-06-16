import { useRecoilState } from "recoil"
import userIdAtom from "../recoil/userIdAtom.js"
import selectedChatIdAtom from "../recoil/selectedChatIdAtom.js"
import { getChannels } from "../utils/ajax/ajaxChannels.js"
import { getMessagesWithId, postMessage, editMessage, deleteMessage } from "../utils/ajax/ajaxMessages.js"
import { useEffect, useState } from "react"
import selectedChatMessagesAtom from "../recoil/selectedChatMessagesAtom.js"
import { getUserName } from "./Header.jsx"
import loggedInAtom from "../recoil/loggedInAtom.js"


const Chat = () => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)
	const [selectedChatName, setSelectedChatName] = useState('')
	const [message, setMessage] = useState('')
	const [editMode, setEditMode] = useState(null)
	const [newMessage, setNewMessage] = useState('')
	// const [updateCount, setUpdateCount] = useState(0)

	// const updateChatComponent = () => {
	// 	setUpdateCount((prevCount) => prevCount + 1)
	// }

	async function getChatName() {
		let channels = await getChannels()
		let isDM = null
		if (userId) {
			let DMs = await getMessagesWithId(userId)
			isDM = DMs.filter(message => (message.sender === selectedChatId) || (message.receiver === selectedChatId))
		}
		let isChannel = channels.find(channel => channel.id === selectedChatId)
		if (isChannel) {
			// console.log('vald kanal är: ', isChannel);
			// console.log('vald kanals meddelanden är: ', chatMessages);
			setSelectedChatName(isChannel.name)
		} else if (isDM) {
			let username = await getUserName(selectedChatId)
			setSelectedChatName(username)
			// console.log('valt DM är: ', username);
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
			console.log('messages är: ', messages);
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
		// TODO: lägg till validering
		if (isLoggedIn) {
			await postMessage(selectedChatId, message, userId)
		} else {
			await postMessage(selectedChatId, message)
		}
		setMessage('')
		// setUpdateCount((prevCount) => prevCount + 1)
		let messages = await fetchMessages()
		console.log('messages är: ', messages);
		setChatMessages(messages)
	}

	useEffect(() => {
		getChatName()
	}, [selectedChatId])

	const fetchMessages = async () => {
		// console.log('inne i fectchMessages');
		let messages = []
		if (selectedChatId > 1000) {
			// console.log('inne i en kanal');
			messages = await getMessagesWithId(selectedChatId)
		} else {
			// console.log('inne i ett DM');
			messages = await getMessagesWithId(selectedChatId, userId)
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

						{chatMessages != [] ?
							chatMessages.map(message => (
								<section key={message.id} className={message.sender === userId ? 'align-right' : null}>
									<p> {message.sender === 0 ? 'Anonym' : message.sender}:
										{editMode === message.id ? (<input type="text"
											onChange={(e) => setNewMessage(e.target.value)}
											value={newMessage}></input>)
											: message.message} </p>
									<p> {message.time} </p>
									{message.sender === userId && (
										<>
											{editMode === message.id ? <button onClick={() => handleSave(message.id)}> Spara </button> : <button onClick={() => handleEdit(message.id)}> Redigera </button>}
											<button onClick={() => handleDelete(message.id)}> Ta bort </button>
										</>
									)}
								</section>
							))
							: chatMessages === [] ? <p>Här var det tomt, skicka ett meddelande för att börja chatta...</p>
								: null}

					</section>
					<section>
						<input type="text" placeholder="Ditt meddelande..." value={message} onChange={(e) => setMessage(e.target.value)} />
						<button onClick={handleSubmit}> Skicka </button>
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