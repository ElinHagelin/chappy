

const getUsers = async () => {
	const response = await fetch('/api/users')
	const data = await response.json()
	return data
}

const getUser = async (userId) => {
	const url = `/api/users/${userId}`
	const response = await fetch(url)
	const data = await response.json()
	return data
}

async function getUserFromJWT(ssKey, setIsLoggedIn, setUserId, setLoggedInUser) {
	let JWTFromSS = sessionStorage.getItem(ssKey)
	if (JWTFromSS) {
		try {
			let response = await fetch('/api/authenticated', { method: "GET", headers: { "Content-Type": "application/json", "Authorization": JWTFromSS } })
			const data = await response.json()
			console.log('userId i getUserFromJWT är: ', data);
			setIsLoggedIn(true)
			setUserId(data.id)
			setLoggedInUser(data.username)

		} catch (error) {
			console.log('Kunde inte hämta användare');
		}
	}
}

export { getUsers, getUser, getUserFromJWT }