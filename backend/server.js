import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import authenticateAndAuthorize from './utils/authentication.js'
import userRouter from "./routes/users.js"
import channelRouter from "./routes/channels.js"
import DMRouter from "./routes/directMessages.js"
import loginRouter from "./routes/login.js"
import authRouter from "./routes/authenticated.js"

const app = express()
dotenv.config()
const port = process.env.PORT || 1337

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.body);
	next()
})


app.use("/api/users", userRouter)
app.use("/api/channels", channelRouter)
app.use("/api/directMessages", DMRouter)
app.use("/api/login", loginRouter)
app.use("/api/authenticated", authenticateAndAuthorize, authRouter)


app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
})