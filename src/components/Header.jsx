import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom.js"
import LoginForm from "./LoginForm.jsx"
import { useRef, useState } from "react"
import { ssKey } from "./LoginForm.jsx"
import userIdAtom from "../recoil/userIdAtom.js"
import { getUsers } from "../utils/ajax/ajaxUsers.js"
import loggedInUserAtom from "../recoil/loggedInUserAtom.js"
import chatAtom from "../recoil/chatAtom.js"
import loginMessageAtom from "../recoil/loginMessageAtom.js"

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
	const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserAtom)
	const [chats, setChats] = useRecoilState(chatAtom)
	const [message, setMessage] = useRecoilState(loginMessageAtom)
	const overlay = useRef(null)
	const [usernameInput, setUsernameInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')

	// console.log('username är: ', username);

	const handleLogin = () => {
		overlay.current.showModal()
	}

	const handleLogout = async () => {
		sessionStorage.removeItem(ssKey)
		setIsLoggedIn(false)
		setUserId(null)
		setLoggedInUser(null)
		setChats([])
	}

	const handleClose = () => {
		setMessage('')
		setUsernameInput('')
		setPasswordInput('')
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
							<span>Inloggad som {loggedInUser}</span>
							<button onClick={handleLogout}> Logga ut </button>
						</>
					) : (
						<button onClick={handleLogin}> Logga in </button>
					)}
				</div>
			</header>
			<dialog ref={overlay} className="overlay" onClick={e => { outsideClick(e) }}>
				<LoginForm onClose={handleClose} usernameInput={usernameInput} setUsernameInput={setUsernameInput} passwordInput={passwordInput} setPasswordInput={setPasswordInput} />
			</dialog>
		</>
	)
}

export default Header