import express from "express"
import { getDb } from "../data/database.js"
import jwt from 'jsonwebtoken'

const router = express.Router()
const db = getDb()
const secret = process.env.SECRET || 'ananas'


router.get('/', (req, res) => {
	res.send({
		message: 'This is secret data. Because you are authenticated.'
	});
})

export default router