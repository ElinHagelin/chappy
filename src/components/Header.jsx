

const Header = () => {

	return (
		<header>
			<h1> Chappy </h1>
			<div className="user-status">
				<span>Inloggad som VänligaVera</span>
				<button> Logga ut </button>
				{/* <!-- När man inte är inloggad visas detta i stället:
				<input type="text" value="VänligaVera" />
				<input type="password" value="1234" />
				<button> Logga in </button> --> */}
			</div>
		</header>
	)
}

export default Header