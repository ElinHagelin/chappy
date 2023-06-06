import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom"
import { useState, useEffect } from "react"

export const ssKey = 'chappy-jwt'

const LoginForm = ({ onClose }) => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [message, setMessage] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	useEffect(() => {
		if (sessionStorage.getItem(ssKey)) {
			setIsLoggedIn(true)
		}
	}, [])

	const handleLogin = async () => {
		let body = { username: username, password: password }
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
		sessionStorage.setItem(ssKey, jwt)

		setIsLoggedIn(true)
		onClose()
	}



	return (
		<form>
			<input
				type="text"
				placeholder="username"
				onChange={e => setUsername(e.target.value)}
				value={username}
			/>
			<input
				type="text"
				placeholder="password"
				onChange={e => setPassword(e.target.value)}
				value={password}
			/>
			<button type="button" onClick={handleLogin}> Logga in </button>
		</form>
	)
}

export default LoginForm