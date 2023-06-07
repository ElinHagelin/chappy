

const getUsers = async () => {
	const response = await fetch('/api/users')
	const data = await response.json()
	return data
}

export { getUsers }