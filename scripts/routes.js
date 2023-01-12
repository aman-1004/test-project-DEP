const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    let session = req.session;
    let name = session.email;
    return res.sendFile("views/index.html", {root: __basedir})
})

router.get('/login', (req, res) => {
    let session = req.session
    if(session.email) {
        return res.redirect("/")
    }
    return res.sendFile("views/login.html", {root: __basedir})
})

router.post("/login", (req, res) => {
    session = req.session;
    session.email = req.body.email
    return res.status(200).send("Logged In")
})

module.exports = router;
