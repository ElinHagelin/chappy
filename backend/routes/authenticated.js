import express from "express"
import { getDb } from "../data/database.js"
import jwt from 'jsonwebtoken'

const router = express.Router()
const db = getDb()
const secret = process.env.SECRET || 'ananas'


router.get('/', (req, res) => {
	console.log('Inne i hemlig data');
	if (req.user) {
		console.log(`${req.user.username} är inloggad`);
	}
	res.send(req.user)
})

export default router