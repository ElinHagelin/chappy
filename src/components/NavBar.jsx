import { useState, useEffect } from "react";
import { getChannels } from "../utils/ajax/ajaxChannels.js"
import { getMessagesWithId } from "../utils/ajax/ajaxMessages.js";
import { useRecoilState } from "recoil";
import loggedInAtom from "../recoil/loggedInAtom.js";
import userIdAtom from "../recoil/userIdAtom.js";
import { getUser, getUsers } from "../utils/ajax/ajaxUsers.js";
import { getUserName } from "./Header.jsx";
import chatAtom from "../recoil/chatAtom.js";
import getDMs from "../utils/getDMs.js";
import selectedChatIdAtom from "../recoil/selectedChatIdAtom.js";
import selectedChatMessagesAtom from "../recoil/selectedChatMessagesAtom.js";



const NavBar = () => {
	const [allChannels, setAllChannels] = useState(null)
	const [publicChannels, setPublicChannels] = useState(null)
	const [users, setUsers] = useState(null)
	const [filteredUsers, setFilteredUsers] = useState(null)
	const [searchQuery, setSearchQuery] = useState("");
	// const [errorMessage, setErrorMessage] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [chats, setChats] = useRecoilState(chatAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)

	async function getAllChannels() {
		// setErrorMessage("");
		try {
			let data = await getChannels()
			let openChannels = data.filter(channel => channel.locked === false)
			setAllChannels(data)
			setPublicChannels(openChannels)
		} catch (error) {
			console.log(error.message)
		}
	}

	async function getAllUsers() {
		try {
			let data = await getUsers()
			// let openChannels = data.filter(channel => channel.locked === false)
			// setAllChannels(data)
			setUsers(data)
		} catch (error) {
			console.log(error.message);
		}
	}

	const handleChatClick = async (id, id2) => {
		setSelectedChatId(id)
		let messages = []
		if (id2) {
			messages = await getMessagesWithId(id, id2)
		} else {
			messages = await getMessagesWithId(id)
		}
		setChatMessages(messages)
	}

	const handleSearch = (e) => {
		if (e.key === 'Enter') {
			const filtered = users.filter((user) =>
				(user.id !== userId) &&
				user.username.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredUsers(filtered)
			setSearchQuery('')
		}
	};


	useEffect(() => {
		const fetchData = async () => {
			await getAllChannels()
			await getAllUsers()
		}
		fetchData()
	}, [])

	useEffect(() => {
		if (isLoggedIn && userId) {
			const fetchDMs = async () => {
				await getDMs(userId, setChats);
			};

			fetchDMs();
			console.log('chats är: ', chats);
		}
	}, [isLoggedIn, userId, chatMessages])

	return (

		<nav>
			<ul>
				<li> [Kanaler] </li>
				{isLoggedIn && allChannels ? (
					allChannels.map(channel => (
						<li className="chat" key={channel.id} onClick={() => handleChatClick(channel.id)}>{channel.name}</li>
					))

				) : !isLoggedIn && publicChannels ?
					publicChannels.map(channel => (
						<li className="chat" key={channel.id} onClick={() => handleChatClick(channel.id)}>{channel.name}</li>
					))
					: <p>Channels loading....</p>}
				<hr />
				{isLoggedIn &&
					(<li title="Direktmeddelanden"> [DM] </li>)
				}

				{isLoggedIn && chats.length !== 0 ? (
					chats.map(c => (
						<li className="chat" key={c.id} onClick={() => handleChatClick(c.id, userId)}>{c.name}</li>
					))
				) : (isLoggedIn && chats.length === 0) ? (
					<p>Loading DM:s...</p>
				) : null}
				{isLoggedIn && (
					<>
						<input type="text" className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleSearch(e)} onBlur={() => setSearchQuery('')} placeholder="Sök efter användare..." />

						{filteredUsers ? filteredUsers.map(user => (
							<li className="chat" key={user.id} onClick={() => handleChatClick(user.id, userId)}>{user.username}</li>
						)) : null}
					</>)
				}
			</ul>
		</nav>
	)
}

export default NavBar