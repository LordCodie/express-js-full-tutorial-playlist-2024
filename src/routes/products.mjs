import { Router } from "express";

const router = Router()

router.get(
    '/api/products',
    (req, res) => {
        // console.log(req.cookies)
        console.log(req.session)
        console.log(req.sessionID)
        if (req.signedCookies.hello && req.signedCookies.hello === 'world')
            return res.status(200).send([{ id: 123, name: 'chicken breast', price: 12.99 }])
        return res.send({ msg: 'Sorry. You need the correct cookie' })
    })

export default router