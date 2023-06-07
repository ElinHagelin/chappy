import { useState, useEffect } from "react";
import { getChannels } from "../utils/ajax/ajaxChannels"
import { getMessages } from "../utils/ajax/ajaxMessages";
import { useRecoilState } from "recoil";
import loggedInAtom from "../recoil/loggedInAtom";



const NavBar = () => {
	const [allChannels, setAllChannels] = useState(null)
	const [publicChannels, setPublicChannels] = useState(null)
	const [DMs, setDMs] = useState(null)
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [chats, setChats] = useState(null)

	async function getAllChannels() {
		setErrorMessage("");
		try {
			let data = await getChannels()
			let openChannels = data.filter(channel => channel.locked === false)
			setAllChannels(data)
			setPublicChannels(openChannels)
		} catch (error) {
			setErrorMessage(error.message)
		}
	}

	async function getDMs() {
		try {
			let data = await getMessages()
			console.log(`messages are: `, data);
			setChats(data)
		} catch (error) {
			console.log(error.message);
		}
	}

	useEffect(() => {
		getAllChannels()
	}, [])

	useEffect(() => {
		getDMs()
		console.log('chats är: ', chats);
	}, [])

	return (

		<nav>
			<ul>
				<li> [Kanaler] </li>
				{isLoggedIn && allChannels ? (
					allChannels.map(channel => (
						<li key={channel.id}>{channel.name}</li>
					))

				) : !isLoggedIn && publicChannels ?
					publicChannels.map(channel => (
						<li key={channel.id}>{channel.name}</li>
					))
					: <p>Channels loading....</p>}
				<hr />
				<li title="Direktmeddelanden"> [DM] </li>
				{isLoggedIn && chats ? (
					chats.map(c => (
						<li>{c.message}</li>
					))
				)
					: isLoggedIn && !chats ? (
						<p>DM:s loading....</p>)
						: null
				}
			</ul>
		</nav>
	)
}

export default NavBar