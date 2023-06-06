import express from "express"
import { getDb } from "../data/database.js"
import jwt from 'jsonwebtoken'
import { log } from "console"
// import { isValidId, isValidMessage, generateNewId } from "../utils/validation.js"

const router = express.Router()
const db = getDb()
const secret = process.env.SECRET || 'ananas'


router.post("/", async (req, res) => {
	await db.read()
	if (!req.body || !req.body.username || !req.body.password) {
		res.sendStatus(400)
		return
	}
	const { username, password } = req.body

	let found = db.data.users.find(user => user.username === username)
	if (!found) {
		console.log('- felaktigt användarnamn')
		res.sendStatus(401)
		return
	}
	if (found.password !== password) {
		console.log('- felaktigt lösenord')
		res.sendStatus(401)
		return
	}

	const hour = 60 * 60
	const payload = { userId: found.id }
	let token = jwt.sign(payload, secret, { expiresIn: 2 * hour })
	console.log('Signed JWT: ', token);
	let tokenPackage = { token: token }
	res.send(tokenPackage)
})

export default router