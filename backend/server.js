import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import authenticateAndAuthorize from './utils/authentication.js'
import userRouter from "./routes/users.js"
import channelRouter from "./routes/channels.js"
import messageRouter from "./routes/messages.js"
import loginRouter from "./routes/login.js"
import authRouter from "./routes/authenticated.js"
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
dotenv.config()
const port = process.env.PORT || 1337

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.body);
	next()
})

const whereWeAre = dirname(fileURLToPath(import.meta.url))
const dist = join(whereWeAre, '../dist')
app.use(express.static(dist))

app.use("/api/users", userRouter)
app.use("/api/channels", channelRouter)
app.use("/api/messages", messageRouter)
app.use("/api/login", loginRouter)
app.use("/api/authenticated", authenticateAndAuthorize, authRouter)

app.get('*', (req, res) => {
	res.sendFile(join(dist, 'index.html'))
})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
})