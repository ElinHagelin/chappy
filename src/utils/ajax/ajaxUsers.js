

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
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": JWTFromSS
				}
			}

			let response = await fetch('/api/authenticated', options)
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

async function createNewUser(username, password) {
	try {
		const baseUrl = "/api/users"

		const newUser = {
			username: username,
			password: password,
		}

		const options = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newUser)
		}

		const response = await fetch(baseUrl, options)
		const data = await response.json()
		console.log('Skapade ny användare: ', newUser);

	} catch (error) {
		console.log('Kunde inte skapa ny användare, error: ', error.message);
	}
}

export { getUsers, getUser, getUserFromJWT, createNewUser }