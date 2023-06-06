import express from "express"
import { getDb } from "../data/database.js"
import { isValidUser, generateNewId, isValidId } from "../utils/validation.js"

const router = express.Router()
const db = getDb()


router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.users)
})


router.get("/:id", async (req, res) => {
	if (!isValidId(req.params.id)) {
		res.sendStatus(400)
		return
	}
	let id = Number(req.params.id)

	await db.read()
	let maybeUser = db.data.users.find((user) => user.id === id)
	if (!maybeUser) {
		res.sendStatus(404)
		return
	}

	res.send(maybeUser)
})


router.post("/", async (req, res) => {
	let maybeUser = req.body

	if (isValidUser(maybeUser)) {
		await db.read()
		maybeUser.id = generateNewId(db.data.users)
		db.data.users.push(maybeUser)
		await db.write()
		res.send({ id: maybeUser.id })
	} else {
		res.sendStatus(400)
	}
})


router.put("/:id", async (req, res) => {
	if (!isValidId(req.params.id) || !isValidUser(req.body)) {
		res.sendStatus(400)
		return
	}
	let id = Number(req.params.id)
	let newUser = req.body

	await db.read()
	let oldUserIndex = db.data.users.findIndex((user) => user.id === id)
	if (oldUserIndex === -1) {
		res.sendStatus(404)
		return
	}
	newUser.id = id
	db.data.users[oldUserIndex] = newUser
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
	let maybeUser = db.data.users.find((user) => user.id === id)
	if (!maybeUser) {
		res.sendStatus(404)
		return
	}

	db.data.users = db.data.users.filter((user) => user.id !== id)
	await db.write()
	res.sendStatus(200)
})

export default router