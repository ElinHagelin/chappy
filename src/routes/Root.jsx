import { useEffect, useState } from 'react'
import './App.css'
import Header from '../components/Header'
import NavBar from '../components/navBar'
import Chat from '../components/Chat'
import { ssKey } from '../components/loginForm'
import { useRecoilState } from 'recoil'
import loggedInAtom from '../recoil/loggedInAtom'
import userIdAtom from '../recoil/userIdAtom'
import loggedInUserAtom from '../recoil/loggedInUserAtom'
import { getUserFromJWT } from '../utils/ajax/ajaxUsers'

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
