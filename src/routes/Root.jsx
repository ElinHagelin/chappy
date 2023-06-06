import { useState } from 'react'
import './App.css'
import Header from '../components/Header'
import NavBar from '../components/navBar'
import Chat from '../components/Chat'

function Root() {
	const [count, setCount] = useState(0)

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
