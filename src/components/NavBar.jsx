import { useState, useEffect } from "react";
import { getChannels } from "../utils/ajax/ajaxChannels.js"
import { getMessagesWithId } from "../utils/ajax/ajaxMessages.js";
import { useRecoilState } from "recoil";
import loggedInAtom from "../recoil/loggedInAtom.js";
import { getUsers } from "../utils/ajax/ajaxUsers.js";
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
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [chats, setChats] = useRecoilState(chatAtom)
	const [selectedChatId, setSelectedChatId] = useRecoilState(selectedChatIdAtom)
	const [chatMessages, setChatMessages] = useRecoilState(selectedChatMessagesAtom)

	async function getAllChannels() {
		let data = await getChannels()
		if (data) {
			let openChannels = data.filter(channel => channel.locked === false)
			setAllChannels(data)
			setPublicChannels(openChannels)
		}
	}

	async function getAllUsers() {
		let data = await getUsers()
		if (data) {
			setUsers(data)
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
				(user.id !== isLoggedIn.id) &&
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
			setFilteredUsers(null)
		}
		fetchData()
	}, [])

	useEffect(() => {
		if (isLoggedIn && isLoggedIn.id) {
			const fetchDMs = async () => {
				await getDMs(isLoggedIn.id, setChats);
			};

			fetchDMs();
		}
	}, [isLoggedIn, chatMessages])

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

				{(isLoggedIn !== null) && (chats.length !== 0) ? (
					chats.map(c => (
						<li className="chat" key={c.id} onClick={() => handleChatClick(c.id, isLoggedIn.id)}>{c.name}</li>
					))
				)
					: null}
				{isLoggedIn !== null && (
					<>
						<input type="text" className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleSearch(e)} onBlur={() => setSearchQuery('')} placeholder="Sök efter användare..." />

						{filteredUsers ? filteredUsers.map(user => (
							<li className="chat" key={user.id} onClick={() => handleChatClick(user.id, isLoggedIn.id)}>{user.username}</li>
						)) : null}
					</>)
				}
			</ul>
		</nav>
	)
}

export default NavBar