const express = require('express');
const session = require('express-session');
const { log, str, generateOTP } = require('./helper');
const {findInSheet, getFromSheet} = require('./spreadsheet-ops.js')
const { sendOTP } = require('./otp')
const router = express.Router()

router.get('/', (req, res) => {
    let session = req.session;
    let name = session.name;
    return res.render("index", {name})
})

router.get('/login', (req, res) => {
    let session = req.session
    if(session.email) {
        return res.redirect("/")
    }
    return res.sendFile("views/login.html", {root: __basedir})
})

router.post("/login/genOTP", (req, res) => {
    let session = req.session;
    const {email} = req.body;
    if(!findInSheet(email)) return res.sendStatus(404)
    const otp = generateOTP()
    session.otp = otp;
    sendOTP(email, otp)
    return res.sendStatus(200) 
})

router.post("/login/verifyOTP", (req,res) => {
    let session = req.session;
    const {email, otp} = req.body
    if(session.otp && session.otp == otp) {
        const {userName} = getFromSheet(email)
        session.email = email 
        session.name = userName
        return res.sendStatus(200)
    }
    return res.sendStatus(403) 
})


router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})
module.exports = router;
