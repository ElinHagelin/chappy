import { useRecoilState } from "recoil"
import userIdAtom from "../recoil/userIdAtom"
import selectedChatIdAtom from "../recoil/selectedChatIdAtom"
import { getChannels } from "../utils/ajax/ajaxChannels"
import { getMessagesWithId, postMessage, editMessage, deleteMessage } from "../utils/ajax/ajaxMessages"
import { useEffect, useState } from "react"
import selectedChatMessagesAtom from "../recoil/selectedChatMessagesAtom"
import { getUserName } from "./Header"
import loggedInAtom from "../recoil/loggedInAtom"


const Chat = () => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)
	const [selectedChatName, setSelectedChatName] = useState('')
	const [message, setMessage] = useState('')
	const [editMode, setEditMode] = useState(false)
	const [newMessage, setNewMessage] = useState('')
	const [updateCount, setUpdateCount] = useState(0)

	const updateChatComponent = () => {
		setUpdateCount((prevCount) => prevCount + 1)
	}

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
		if (editMode === messageId) {
			setEditMode(null)
			editMessage(messageId, newMessage)
			// let newChatList = chatMessages.map(message => {
			// 	console.log(message);
			// 	if (message.id === messageId) {
			// 		message.message = newMessage
			// 	}
			// })
			// setChatMessages(newChatList)
		} else {
			setEditMode(messageId)
		}
	}

	const handleDelete = (messageId) => {
		deleteMessage(messageId)
		setChatMessages((prevMessages) =>
			prevMessages.filter((message) => message.id !== messageId)
		);
	}

	const handleSubmit = () => {
		// TODO: lägg till validering
		if (isLoggedIn) {
			postMessage(selectedChatId, message, userId)
		} else {
			postMessage(selectedChatId, message)
		}
		setMessage('')
	}


	useEffect(() => {
		getChatName()
	}, [selectedChatId])


	return (
		<div className="chat-area">
			{selectedChatId ? (
				<>
					<section className="heading">
						Chattar i <span className="chat-name"> #{selectedChatName} </span>
					</section>
					<section className="history">

						{chatMessages ?
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
											<button onClick={() => handleEdit(message.id)}> Redigera </button>
											<button onClick={() => handleDelete(message.id)}> Ta bort </button>
										</>
									)}
								</section>
							)
							) : <p>No messages yet...</p>}

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