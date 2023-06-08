import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom"
import LoginForm from "./loginForm"
import { useRef, useState } from "react"
import { ssKey } from "./loginForm"
import userIdAtom from "../recoil/userIdAtom"
import { getUsers } from "../utils/ajax/ajaxUsers"
import usernameAtom from "../recoil/usernameAtom"
import chatAtom from "../recoil/chatAtom"

export const getUserName = async (userId) => {
	let allUsers = await getUsers()
	// console.log(allUsers);
	// console.log('userId är: ', userId);
	let user = allUsers.find(user => user.id == userId)
	// console.log('username är: ', user.username);
	return user.username
}

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [username, setUsername] = useRecoilState(usernameAtom)
	const [chats, setChats] = useRecoilState(chatAtom)
	const overlay = useRef(null)

	// console.log('username är: ', username);

	const handleLogin = () => {
		overlay.current.showModal()
	}

	const handleLogout = async () => {
		sessionStorage.removeItem(ssKey)
		setIsLoggedIn(false)
		setUserId(null)
		setUsername(null)
		setChats([])
	}

	const handleClose = () => {
		overlay.current.close()
	}

	const outsideClick = (e) => {
		const dialogDimensions = overlay.current.getBoundingClientRect();
		if (
			e.clientX < dialogDimensions.left ||
			e.clientX > dialogDimensions.right ||
			e.clientY < dialogDimensions.top ||
			e.clientY > dialogDimensions.bottom
		) {
			handleClose();
		}
	}

	return (
		<>
			<header>
				<h1> Chappy </h1>
				<div className="user-status">
					{isLoggedIn ? (
						<>
							<span>Inloggad som {username}</span>
							<button onClick={handleLogout}> Logga ut </button>
						</>
					) : (
						<button onClick={handleLogin}> Logga in </button>
					)}
				</div>
			</header>
			<dialog ref={overlay} className="overlay" onClick={e => { outsideClick(e) }}>
				<LoginForm onClose={handleClose} />
			</dialog>
		</>
	)
}

export default Header