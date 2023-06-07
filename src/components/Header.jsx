import { useRecoilState } from "recoil"
import loggedInAtom from "../recoil/loggedInAtom"
import LoginForm from "./loginForm"
import { useRef } from "react"
import { ssKey } from "./loginForm"
import userIdAtom from "../recoil/userIdAtom"


const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInAtom)
	const [userId, setUserId] = useRecoilState(userIdAtom)
	const overlay = useRef(null)

	const handleLogin = () => {
		overlay.current.showModal()
	}

	const handleLogout = async () => {
		sessionStorage.removeItem(ssKey)
		setIsLoggedIn(false)
		setUserId(null)
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
							<span>Inloggad som VänligaVera</span>
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