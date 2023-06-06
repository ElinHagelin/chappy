import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import userRouter from "./routes/users.js"

const app = express()
dotenv.config()
const port = process.env.PORT || 1337
const secret = process.env.SECRET || 'ananas'

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.body);
	next()
})


// GET /users
// GET /users/:id
// GET /channels
// GET /channels/:id

// 1 router för users
// 1 router för channels
// 1 router för DMs

app.use("/api/users", userRouter)

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
})