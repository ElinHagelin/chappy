import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom.js"
import { useEffect } from "react"
import { getUserName } from "./Header.jsx"
import loginMessageAtom from "../recoil/loginMessageAtom.js"
import { CheckIfUserIsValid, checkIfNewUser } from "../utils/validation.js"
import { createNewUser, editUser, getUserFromJWT } from "../utils/ajax/ajaxUsers.js"
import editUserAtom from "../recoil/editUserAtom.js"
import login from "../utils/ajax/ajaxLogin.js"

export const ssKey = 'chappy-jwt'

const LoginForm = ({ onClose, usernameInput, setUsernameInput, passwordInput, setPasswordInput }) => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [message, setMessage] = useRecoilState(loginMessageAtom)
	const [editUserMode, setEditUserMode] = useRecoilState(editUserAtom)


	useEffect(() => {
		async function fetchUserFromJWT() {
			if (sessionStorage.getItem(ssKey)) {
				let user = await getUserFromJWT(ssKey)
				setIsLoggedIn(user)
			}
		}
		fetchUserFromJWT()
	}, [])


	const handleLogin = async () => {
		let data = await login(usernameInput, passwordInput)
		if (!data) {
			setMessage('Fel användarnamn eller lösenord!')
			return
		}
		let jwt = data.token
		sessionStorage.setItem(ssKey, jwt)

		const user = {
			username: await getUserName(data.userId),
			id: data.userId
		}
		setIsLoggedIn(user)
		setMessage('')
		setUsernameInput('')
		setPasswordInput('')
		onClose()
	}

	const handleNewUser = async () => {
		let maybeUser = {
			username: usernameInput,
			password: passwordInput
		}
		let userIsValid = CheckIfUserIsValid(maybeUser)
		let userIsNew = await checkIfNewUser(maybeUser)
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
		let maybeUser = {
			username: usernameInput,
			password: passwordInput
		}
		let userIsValid = CheckIfUserIsValid(maybeUser)
		if (userIsValid) {
			editUser(isLoggedIn.id, maybeUser)
			let updatedUser = {
				username: maybeUser.username,
				id: isLoggedIn.id
			}
			setIsLoggedIn(updatedUser)
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