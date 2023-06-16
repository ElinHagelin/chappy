


const login = async (username, password) => {
	try {
		let body = { username: username, password: password }
		let options = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		}

		const response = await fetch('/api/login', options)
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Login failed: ', error.message);
		return false
	}
}

export default login