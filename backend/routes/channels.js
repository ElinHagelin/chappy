import express from "express"
import { getDb } from "../data/database.js"
import { isValidId, isValidChannel, generateNewId } from "../utils/validation.js"

const router = express.Router()
const db = getDb()

router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.channels)
})

router.get("/:id", async (req, res) => {
	if (!isValidId(req.params.id)) {
		res.sendStatus(400)
		return
	}
	let id = Number(req.params.id)

	await db.read()
	let maybeChannel = db.data.channels.find((channel) => channel.id === id)
	if (!maybeChannel) {
		res.sendStatus(404)
		return
	}

	res.send(maybeChannel)
})

router.post("/", async (req, res) => {
	let maybeChannel = req.body

	if (isValidChannel(maybeChannel)) {
		await db.read()
		maybeChannel.id = generateNewId(db.data.channels)
		db.data.channels.push(maybeChannel)
		await db.write()
		res.send({ id: maybeChannel.id })
	} else {
		res.sendStatus(400)
	}
})

export default router