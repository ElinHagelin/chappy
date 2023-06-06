

function isValidUser(u) {
	if (typeof u !== "object") {
		return false
	} else if (u === null) {
		return false
	}

	let nameIsValid = typeof u.username === "string"
	nameIsValid = nameIsValid && u.username !== ""

	let passwordIsValid = typeof u.password === "string"
	passwordIsValid = passwordIsValid && u.password !== ""

	if (!nameIsValid || !passwordIsValid) {
		return false
	}
	return true
}

function generateNewId(list) {
	let maxId = 0
	for (const item of list) {
		if (item.id && item.id > maxId) {
			maxId = item.id
		}
	}
	return maxId + 1
}

function isValidId(id) {
	let maybeId = Number(id)
	if (isNaN(maybeId)) {
		return false
	}
	return maybeId >= 0
}

export { isValidUser, generateNewId, isValidId }