import { getUsers } from "./ajax/ajaxUsers";


async function checkIfNewUser(u) {
	let allUsers = await getUsers()
	let check = allUsers.find(user => user.username === u.name)
	if (check) {
		return false
	}
	return true
}

function CheckIfUserIsValid(u) {
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

export { checkIfNewUser, CheckIfUserIsValid }