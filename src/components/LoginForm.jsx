import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom.js"
import { useState, useEffect } from "react"
import userIdAtom from "../recoil/userIdAtom.js"
import loggedInUserAtom from "../recoil/loggedInUserAtom.js"
import { getUserName } from "./Header.jsx"
import loginMessageAtom from "../recoil/loginMessageAtom.js"
import { CheckIfUserIsValid, checkIfNewUser } from "../utils/validation.js"
import { createNewUser, editUser } from "../utils/ajax/ajaxUsers.js"
import editUserAtom from "../recoil/editUserAtom.js"

export const ssKey = 'chappy-jwt'

const LoginForm = ({ onClose, usernameInput, setUsernameInput, passwordInput, setPasswordInput }) => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserAtom)
	const [message, setMessage] = useRecoilState(loginMessageAtom)
	const [editUserMode, setEditUserMode] = useRecoilState(editUserAtom)


	useEffect(() => {
		if (sessionStorage.getItem(ssKey)) {
			setIsLoggedIn(true)
		}
	}, [])


	const handleLogin = async () => {
		let body = { username: usernameInput, password: passwordInput }
		console.log('body är: ', body);
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

		setMessage('')
		setIsLoggedIn(true)
		setUserId(uId)
		setLoggedInUser(uName)
		setUsernameInput('')
		setPasswordInput('')
		onClose()
	}

	const handleNewUser = async () => {
		console.log('skapa ny användare');
		let maybeUser = {
			username: usernameInput,
			password: passwordInput
		}
		let userIsValid = CheckIfUserIsValid(maybeUser)
		let userIsNew = checkIfNewUser(maybeUser)
		if (!userIsValid) {
			setMessage('Vänligen fyll i båda fälten')
		} else if (!userIsNew) {
			setMessage('Användarnamnet är upptaget')
		} else if (userIsValid && userIsNew) {
			await createNewUser(maybeUser)
			await handleLogin()
		}
	}

	const handleEditUser = async () => {
		console.log('Ändra profil');
		let maybeUser = {
			username: usernameInput,
			password: passwordInput
		}
		let userIsValid = CheckIfUserIsValid(maybeUser)
		if (userIsValid) {
			editUser(userId, maybeUser)
			setLoggedInUser(maybeUser.username)
			onClose()
		} else {
			setMessage('Vänligen fyll i båda fälten')
		}
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
			<span className='login-error'>{message ? message : null}</span>
			{editUserMode ? (
				<button type="button" onClick={handleEditUser}> Spara </button>
			)
				: (
					<>
						<button type="button" onClick={handleLogin}> Logga in </button>
						<button type="button" onClick={handleNewUser}> Skapa ny användare </button>
					</>
				)}
		</form>
	)


}

export default LoginForm