import { useEffect } from 'react'
import './App.css'
import Header from '../components/Header.jsx'
import NavBar from '../components/NavBar.jsx'
import Chat from '../components/Chat.jsx'
import { ssKey } from '../components/LoginForm.jsx'
import { useRecoilState } from 'recoil'
import loggedInAtom from '../recoil/loggedInAtom.js'
import { getUserFromJWT } from '../utils/ajax/ajaxUsers.js'

function Root() {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)

	useEffect(() => {
		getUserFromJWT(ssKey, setIsLoggedIn)

	}, [])

	return (
		<>
			<Header />
			<main>
				<NavBar />
				<Chat />
			</main>
		</>
	)
}

export default Root
