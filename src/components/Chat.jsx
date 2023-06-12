import { useRecoilState } from "recoil"
import userIdAtom from "../recoil/userIdAtom"
import selectedChatIdAtom from "../recoil/selectedChatIdAtom"
import { getChannels } from "../utils/ajax/ajaxChannels"
import { getMessagesWithId, postMessage } from "../utils/ajax/ajaxMessages"
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
	const [senderName, setSenderName] = useState('')
	const [message, setMessage] = useState('')

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
			// OM .sender är userId 
			// - välj .receiver och ta fram namnet med getUserName()

			// ANNARS 
			// tvärtom
			console.log('valt DM är: ', isDM);
		}
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

	// useEffect(() => {
	// 	// let senderNames = chatMessages.map(message => getUserName(message.sender))
	// 	// console.log('senderNames är: '), senderNames;
	// }, [chatMessages, selectedChatId]);

	return (
		<div className="chat-area">
			<section className="heading">
				Chattar i <span className="chat-name"> #{selectedChatName} </span>
			</section>
			<section className="history">

				{chatMessages ?
					chatMessages.map(message => (
						<section className={message.sender === userId ? 'align-right' : null}>
							<p> {message.sender === 0 ? 'Anonym' : message.sender}: {message.message} </p>
							<p> {message.time} </p>
						</section>
					)
					) : <p>No messages yet...</p>}

			</section>
			<section>
				<input type="text" placeholder="Ditt meddelande..." value={message} onChange={(e) => setMessage(e.target.value)} />
				<button onClick={handleSubmit}> Skicka </button>
			</section>
		</div>
	)
}

export default Chat