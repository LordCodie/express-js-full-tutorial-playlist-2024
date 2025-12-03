import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import indexRoute from './routes/index.mjs'
import { mockUsers } from "./utils/constants.mjs";

const app = express()

app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(session({
    secret: 'Anson the dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}))

app.use(indexRoute)

const PORT = 3000 || process.env.PORT

app.get("/", (req, res) => {
    req.session.visted = true
    res.cookie('hello', 'world', { maxAge: 60000 * 60, signed: true })
    res.status(201).send({ msg: 'hello' })
})

app.post('/api/auth', (req, res) => {
    const { body: { username, password } } = req
    const findUser = mockUsers.find(user => user.username === username)
    if (!findUser || findUser.password !== password)
        return res.status(401).send({ msg: 'BAD CREDENTIALS' })
    req.session.user = findUser
    return res.status(200).send(findUser)
})

app.get('/api/auth/status', (req, res) => {
    return req.session.user ?
        res.status(200).send(req.session.user)
        : res.status(401).send({ msg: "NOT AUTHENTICATED" })
})

app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`)
})