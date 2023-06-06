import { getDb } from "../data/database.js"
const db = getDb()

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

async function isValidMessage(m) {
	await db.read()

	if (typeof m !== "object") {
		return false
	} else if (m === null) {
		return false
	}

	let messageIsValid = typeof m.message === "string"
	messageIsValid = messageIsValid && m.message !== ""

	let senderIsValid = typeof m.sender === "number"
	senderIsValid = senderIsValid && db.data.users.find(user => user.id === m.sender)

	let receiverIsValid = typeof m.receiver === "number"
	receiverIsValid = receiverIsValid && (db.data.users.find(user => user.id === m.receiver) || db.data.channels.find(channel => channel.id === m.receiver))

	if (!messageIsValid || !senderIsValid || !receiverIsValid) {
		return false
	}
	return true
}

export { isValidUser, generateNewId, isValidId, isValidMessage }