import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { readUserValidationSchema, createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router()

router.get("/api/users",
    checkSchema(readUserValidationSchema),
    (req, res) => {
        // console.log(req.session.id)
        req.sessionStore.get(req.session.id, (error, sessionData) => {
            if (error) {
                console.log(error)
                throw error
            }
            console.log(sessionData)
        })
        const result = validationResult(req)
        console.log(result)
        const { query: { filter, value } } = req
        if (!filter || !value)
            return res.status(200).send(mockUsers)
        if (filter && value) return res.send(
            mockUsers.filter(user =>
                user[filter].includes(value)
            )
        )
        res.status(200).send(mockUsers)
    })

router.post('/api/users',
    checkSchema(createUserValidationSchema),
    (req, res) => {
        const result = validationResult(req)
        console.log(result)
        const reqErrors = result.isEmpty()
        if (!reqErrors) return res.status(400).send({ errors: result.array() })
        const data = matchedData(req)
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }
        mockUsers.push(newUser)
        return res.status(201).send(mockUsers)
    })

router.get("/api/users/:id",
    (req, res) => {
        const { findUserIndex } = req
        const findUser = mockUsers[findUserIndex]
        if (!findUser) return res.sendStatus(404)
        return res.send(findUser)
    })

router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body }
    return res.sendStatus(200)
})

router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    return res.sendStatus(200)
})

router.delete("/api/users/:id", (req, res) => {
    const { findUserIndex } = req
    mockUsers.splice(findUserIndex, 1)
    return res.sendStatus(200)
})

export default router