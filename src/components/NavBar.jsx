import { useState, useEffect } from "react";
import { getChannels } from "../utils/ajax/ajaxChannels"
import { getMessagesWithId } from "../utils/ajax/ajaxMessages";
import { useRecoilState } from "recoil";
import loggedInAtom from "../recoil/loggedInAtom";
import userIdAtom from "../recoil/userIdAtom";
import { getUser } from "../utils/ajax/ajaxUsers";
import { getUserName } from "./Header";
import chatAtom from "../recoil/chatAtom";



const NavBar = () => {
	const [allChannels, setAllChannels] = useState(null)
	const [publicChannels, setPublicChannels] = useState(null)
	const [DMs, setDMs] = useState(null)
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [chats, setChats] = useRecoilState(chatAtom)

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

	async function getChatPals() {
		try {
			console.log('DMs är: ', DMs);
			let DMList = []

			await Promise.all(
				DMs.map(async (message) => {
					// console.log('Inne i forEach, DMList är: ', DMList);
					if (message.sender == userId) {
						// console.log('Användaren är avsändare');
						const name = await getUserName(message.receiver)
						if (DMList.indexOf(name) === -1) {
							// console.log(`${name} finns inte med i listan`);
							DMList = [...DMList, name]
							// console.log(`Lagt till ${name}, DMList är: `, DMList);
						}

					} else if (message.receiver == userId) {
						// console.log('Användaren är mottagare');
						const name = await getUserName(message.sender)
						if (DMList.indexOf(name) === -1) {
							// console.log(`${name} finns inte med i listan`);
							DMList = [...DMList, name]
							// console.log(`Lagt till ${name}, DMList är: `, DMList);
						}
					}
				})
			)
			// console.log('Utanför forEach, DMList är: ', DMList);
			setChats(DMList)

		} catch (error) {
			console.log('getChatPals: ', error.message);
		}
		// console.log('chats är: ', chats);
	}

	async function getDMs() {
		try {
			let data = await getMessagesWithId(userId)
			let filteredData = data.filter(m => m.receiver < 1000)
			console.log(`messages are: `, filteredData);
			setDMs(filteredData)

		} catch (error) {
			console.log('getDMs error: ', error.message);
		}
	}

	useEffect(() => {
		getAllChannels()
	}, [])

	useEffect(() => {
		if (isLoggedIn) {
			const fetchData = async () => {
				await getDMs();
				await getChatPals();
			};

			fetchData();
			console.log('chats är: ', chats);
		}
	}, [isLoggedIn])

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
				{isLoggedIn &&
					(<li title="Direktmeddelanden"> [DM] </li>)
				}

				{isLoggedIn && (chats.length !== 0) ? (
					chats.map(c => (
						<li key={c}>{c}</li>
					))
				)
					: isLoggedIn && (chats.length === 0) ? (
						<p>DM:s loading....</p>)
						: <p>No DM:s...</p>
				}
			</ul>
		</nav>
	)
}

export default NavBar