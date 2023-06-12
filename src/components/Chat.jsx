import { useRecoilState } from "recoil"
import userIdAtom from "../recoil/userIdAtom"
import selectedChatIdAtom from "../recoil/selectedChatIdAtom"
import { getChannels } from "../utils/ajax/ajaxChannels"
import { getMessagesWithId, postMessage } from "../utils/ajax/ajaxMessages"
import { useEffect, useState } from "react"
import selectedChatMessagesAtom from "../recoil/selectedChatMessagesAtom"
import { getUserName } from "./Header"


const Chat = () => {
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)
	const [selectedChatName, setSelectedChatName] = useState('')
	const [senderName, setSenderName] = useState('')
	const [message, setMessage] = useState('')

	async function getChatName() {
		let channels = await getChannels()
		let DMs = await getMessagesWithId(userId)
		let isChannel = channels.find(channel => channel.id === selectedChatId)
		let isDM = DMs.find(DM => DM.id === selectedChatId)
		if (isChannel) {
			// console.log('vald kanal är: ', isChannel);
			// console.log('vald kanals meddelanden är: ', chatMessages);
			setSelectedChatName(isChannel.name)
		} else if (isDM) {
			console.log('valt DM är: ', isDM);
		}
	}

	const handleSubmit = () => {
		postMessage(userId, selectedChatId, message)
	}


	useEffect(() => {
		getChatName()
	}, [selectedChatId])

	useEffect(() => {
		let senderNames = chatMessages.map(message => getUserName(message.sender))
		// console.log('senderNames är: '), senderNames;
	}, [chatMessages, selectedChatId]);

	return (
		<div className="chat-area">
			<section className="heading">
				Chattar i <span className="chat-name"> #{selectedChatName} </span>
			</section>
			<section className="history">


				{/* Kolla vilka meddelanden som användaren är avsändare till och sätt className="align-right" på dom.
				className={sender === id ? "align-right" : null} */}
				{chatMessages ?
					chatMessages.map(message => (
						<section className={message.sender === userId ? 'align-right' : null}>
							<p> {message.sender}: {message.message} </p>
							<p> {message.time} </p>
						</section>
					)
					) : <p>No messages yet...</p>}

			</section>
			<section>
				<input type="text" placeholder="Ditt meddelande..." vlaue={message} onChange={(e) => setMessage(e.target.value)} />
				<button onClick={handleSubmit}> Skicka </button>
			</section>
		</div>
	)
}

export default Chat