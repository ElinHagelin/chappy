

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

export { getUsers, getUser }