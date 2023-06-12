import { useRecoilState } from "recoil"
import userIdAtom from "../recoil/userIdAtom"
import selectedChatIdAtom from "../recoil/selectedChatIdAtom"
import { getChannels } from "../utils/ajax/ajaxChannels"
import { getMessagesWithId } from "../utils/ajax/ajaxMessages"
import { useEffect, useState } from "react"
import selectedChatMessagesAtom from "../recoil/selectedChatMessagesAtom"


const Chat = () => {
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)
	const [selectedChatName, setSelectedChatName] = useState('')

	async function getChatName() {
		let channels = await getChannels()
		let DMs = await getMessagesWithId(userId)
		let isChannel = channels.find(channel => channel.id === selectedChatId)
		let isDM = DMs.find(DM => DM.id === selectedChatId)
		if (isChannel) {
			console.log('vald kanal är: ', isChannel);
			console.log('vald kanals meddelanden är: ', chatMessages);
			setSelectedChatName(isChannel.name)
		} else if (isDM) {
			console.log('valt DM är: ', isDM);
		}
	}

	useEffect(() => {
		getChatName()
	}, [selectedChatId])

	return (
		<div className="chat-area">
			<section className="heading">
				Chattar i <span className="chat-name"> #{selectedChatName} </span>
			</section>
			<section className="history">


				{/* Kolla vilka meddelanden som användaren är avsändare till och sätt className="align-right" på dom.
				className={sender === id ? "align-right" : null} */}
				{/* {chatMessages ? } */}
				<section className="align-right">
					<p> VänligaVera: hejsan </p>
					<p> 17:46 </p>
				</section>

				<section>
					<p> MunterMoa: tjena! </p>
					<p> 17:47 </p>
				</section>

			</section>
			<section>
				<input type="text" placeholder="Ditt meddelande..." />
				<button> Skicka </button>
			</section>
		</div>
	)
}

export default Chat