

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

async function createNewUser(newUser) {
	try {
		const baseUrl = "/api/users"

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

const deleteUser = async (userId) => {
	try {
		const url = `/api/users/${userId}`

		const options = {
			method: "DELETE",
		}

		const response = await fetch(url, options)
		console.log("success")
		return true
	}

	catch (error) {
		console.log("Delete status failed: ", response)
		return false
	}

}

const editUser = async (userId, updatedUser) => {
	try {
		const url = `/api/users/${userId}`

		// let allUsers = await getUser()
		// const targetUser = allUsers.find(user => user.id === userId)

		const body = updatedUser

		const options = {
			method: 'PUT',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		}

		let response = await fetch(url, options)
		console.log(response)

	} catch (error) {
		console.log('Edit status failed');
	}
}

export { getUsers, getUser, getUserFromJWT, createNewUser, deleteUser, editUser }