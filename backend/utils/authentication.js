import jwt from 'jsonwebtoken'
import { getDb } from "../data/database.js"

const db = getDb()
const secret = process.env.SECRET || 'ananas'

const authenticateAndAuthorize = (async (req, res, next) => {
	await db.read()
	let authHeader = req.headers.authorization
	if (!authHeader) {
		res.status(401).send({
			message: 'You must be authenticated to view this very secret data.'
		})
		return
	}
	let token = authHeader.replace('Bearer: ', '')

	try {
		let decoded = jwt.verify(token, secret)
		console.log('GET /secret decoded: ', decoded);
		let userId = decoded.userId
		let user = db.data.users.find(u => u.id === userId)
		console.log(`User "${user.username}" has access to secret data.`)

		next()
	} catch (error) {
		console.log('GET /secret error: ' + error.message);
		res.sendStatus(401)
	}
})

export default authenticateAndAuthorize