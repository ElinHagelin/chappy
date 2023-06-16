

const getUsers = async () => {
	try {
		const response = await fetch('/api/users')
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Get users failed: ', error.message);
	}
}

const getUser = async (userId) => {
	try {
		const url = `/api/users/${userId}`
		const response = await fetch(url)
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Get user failed: ', error.message);
	}
}

async function getUserFromJWT(ssKey, setIsLoggedIn) {
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

			let user = {
				username: data.username,
				id: data.id
			}
			return user

		} catch (error) {
			console.log('Could not find the user: ', error.message);
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

	} catch (error) {
		console.log('Create new user failed: ', error.message);
	}
}

const deleteUser = async (userId) => {
	try {
		const url = `/api/users/${userId}`

		const options = {
			method: "DELETE",
		}

		const response = await fetch(url, options)

	} catch (error) {
		console.log("Delete failed: ", error.message)
	}
}

const editUser = async (userId, updatedUser) => {
	try {
		const url = `/api/users/${userId}`

		const body = updatedUser

		const options = {
			method: 'PUT',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		}

		let response = await fetch(url, options)

	} catch (error) {
		console.log('Edit failed', error.message);
	}
}

export { getUsers, getUser, getUserFromJWT, createNewUser, deleteUser, editUser }