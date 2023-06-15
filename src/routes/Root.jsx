import { useEffect, useState } from 'react'
import './App.css'
import Header from '../components/Header.jsx'
import NavBar from '../components/NavBar.jsx'
import Chat from '../components/Chat.jsx'
import { ssKey } from '../components/LoginForm.jsx'
import { useRecoilState } from 'recoil'
import loggedInAtom from '../recoil/loggedInAtom.js'
import userIdAtom from '../recoil/userIdAtom.js'
import loggedInUserAtom from '../recoil/loggedInUserAtom.js'
import { getUserFromJWT } from '../utils/ajax/ajaxUsers.js'

function Root() {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserAtom)

	useEffect(() => {
		getUserFromJWT(ssKey, setIsLoggedIn, setUserId, setLoggedInUser)

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
