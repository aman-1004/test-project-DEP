const express = require('express');
const session = require('express-session');
const { log, str, generateOTP } = require('./helper');
const {findInSheet, getFromSheet} = require('./spreadsheet-ops.js')
const { sendOTP } = require('./otp')
const router = express.Router()

_views = {root: __basedir + "/views/"}
console.log(_views)

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
    return res.sendFile("login.html", _views)
})

router.post("/login/genOTP", async (req, res) => {
    let session = req.session;
    const {email} = req.body;
    if(!(await findInSheet(email))) return res.sendStatus(404)
    const otp = generateOTP()
    session.otp = otp;
    sendOTP(email, otp)
    return res.sendStatus(200) 
})

router.post("/login/verifyOTP", async (req,res) => {
    let session = req.session;
    const {email, otp} = req.body
    if(session.otp && session.otp == otp) {
        const {userName} = await getFromSheet(email)
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

router.get('/student', (req, res) => {
    const studentId = req.session.id;
    // const courses = getCourses(studentId)
    results = ["Data Structures", "Computer Vision", "Social Computing"]
    res.render('student.ejs', results)
})

router.get("/offerings", (req, res) => {
    const offerings = [{
        title: "Data Structures", 
        instructor_id: 121,
    }, {
        title: "Computer Networks",
        instructor_id: 131,
    }
    ];
    res.render("offerings.ejs", {offerings})
})

router.get("/instructor", (req, res) => {
    const pending_approvals = [{
        studentName: "Aman",
        courseName: "Social Computing"
    },
    {   studentName: "Lakshay",
        courseName: "Introduction to Fantasy and Science Fiction",
    }]
    res.render("instructor.ejs", {approvals: pending_approvals})
})