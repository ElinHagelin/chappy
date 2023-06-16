import express from "express"
import { getDb } from "../data/database.js"
import { isValidId, isValidMessage, generateNewId } from "../utils/validation.js"

const router = express.Router()
const db = getDb()

router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.messages)
})


router.get("/:id", async (req, res) => {
	if (!isValidId(req.params.id)) {
		res.sendStatus(400)
		return
	}
	let id = Number(req.params.id)

	await db.read()
	let maybeChats = db.data.messages.filter((message) => message.sender.id === id || message.receiver === id)
	if (!maybeChats) {
		res.sendStatus(404)
		return
	}

	res.send(maybeChats)
})

router.post("/", async (req, res) => {
	let maybeMessage = req.body

	if (isValidMessage(maybeMessage)) {
		await db.read()
		let timestamp = new Date().toLocaleString("sv-SE")
		maybeMessage.time = timestamp
		maybeMessage.id = generateNewId(db.data.messages)
		db.data.messages.push(maybeMessage)
		await db.write()
		res.send(maybeMessage)
	} else {
		res.sendStatus(400)
	}
})


router.put("/:id", async (req, res) => {
	if (!isValidId(req.params.id) || !isValidMessage(req.body)) {
		res.sendStatus(400)
		return
	}
	let id = Number(req.params.id)
	let updatedMessage = req.body

	await db.read()
	let oldMessageIndex = db.data.messages.findIndex((message) => message.id === id)
	if (oldMessageIndex === -1) {
		res.sendStatus(404)
		return
	}
	updatedMessage.id = id
	db.data.messages[oldMessageIndex] = updatedMessage
	await db.write()
	res.sendStatus(200)
})


router.delete("/:id", async (req, res) => {
	if (!isValidId(req.params.id)) {
		res.sendStatus(400)
		return
	}
	let id = Number(req.params.id)

	await db.read()
	let maybeMessage = db.data.messages.find((message) => message.id === id)
	if (!maybeMessage) {
		res.sendStatus(404)
		return
	}

	db.data.messages = db.data.messages.filter((message) => message.id !== id)
	await db.write()
	res.send()
})

export default router