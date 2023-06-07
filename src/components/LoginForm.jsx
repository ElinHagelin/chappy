import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom"
import { useState, useEffect } from "react"
import userIdAtom from "../recoil/userIdAtom"
import usernameAtom from "../recoil/usernameAtom"
import { getUserName } from "./Header"

export const ssKey = 'chappy-jwt'

const LoginForm = ({ onClose }) => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [username, setUsername] = useRecoilState(usernameAtom)
	const [message, setMessage] = useState('')
	const [usernameInput, setUsernameInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')

	useEffect(() => {
		if (sessionStorage.getItem(ssKey)) {
			setIsLoggedIn(true)
		}
	}, [])

	const handleLogin = async () => {
		let body = { username: usernameInput, password: passwordInput }
		let options = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		}

		const response = await fetch('/api/login', options)
		if (response.status !== 200) {
			setMessage('Det gick inte att logga in!')
			console.log('Login failed with status: ', response.status);
			return
		}
		const data = await response.json()
		let jwt = data.token
		let uId = data.userId
		let uName = await getUserName(uId)
		console.log('userId är: ', uId);
		sessionStorage.setItem(ssKey, jwt)

		setIsLoggedIn(true)
		setUserId(uId)
		setUsername(uName)
		onClose()
	}



	return (
		<form>
			<input
				type="text"
				placeholder="username"
				onChange={e => setUsernameInput(e.target.value)}
				value={usernameInput}
			/>
			<input
				type="text"
				placeholder="password"
				onChange={e => setPasswordInput(e.target.value)}
				value={passwordInput}
			/>
			<button type="button" onClick={handleLogin}> Logga in </button>
		</form>
	)
}

export default LoginForm