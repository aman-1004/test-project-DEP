const express = require('express');
const session = require('express-session');
const { log, str, generateOTP } = require('./helper');
const {findInSheet, getFromSheet} = require('./spreadsheet-ops.js')
const { sendOTP } = require('./otp')

const {
  checkStudent,
  checkInstructor,
  checkStudentEnroll,
  enrollStudent,
  getUser,
  getPendingCourses,
  getEnrolledCourses,
  getOfferings,
  setEnrollment,
  getPendingApprovals,
  getPendingAdvisorApprovals
} = require('./db/queries')

const router = express.Router()

_views = {root: __basedir + "/views/"}
console.log(_views)

router.get('/', (req, res) => {
    let session = req.session;
    let name = session.name;
    if(session.userType==0) res.redirect('/student')
    else res.redirect('/instructor')
    // return res.render("index", {name})
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
    // if(!(await findInSheet(email))) return res.sendStatus(404)
    let userGet = await getUser(email);
    if(Object.keys(userGet).length==0) return res.sendStatus(404);
    const otp = generateOTP()
    session.otp = otp;
    sendOTP(email, otp)
    return res.sendStatus(200) 
})

router.post("/login/verifyOTP", async (req,res) => {
    let session = req.session;
    const {email, otp} = req.body
    if(session.otp && session.otp == otp) {
//        const {userName} = await getFromSheet(email)
        let userGet = await getUser(email);
        const {name, userType, id} = userGet
        session.email = email 
        session.name = name 
        session.userType = userType;
        session.userId = id;
        return res.sendStatus(200)
    }
    return res.sendStatus(403) 
})


router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})
module.exports = router;

router.get('/student', async (req, res) => {
    const studentId = req.session.id;
    // const courses = getCourses(studentId)
//     let enrolled = [{
//         coursetitle: "Data Structures",
//         instructorname: "Lakshay Bansal"
//     }
// ]
    let enrolled = await getEnrolledCourses(req.session.userId)
//    let pending = [{
//        coursetitle: "Social Computing",
//        instructorname: "Aman Kumar",
//        status: "Pending Advisor Approval"
//    }]
    let pending = await getPendingCourses(req.session.userId);
    res.render('student.ejs', {enrolled, pending})
})

router.get("/offerings", async (req, res) => {
    let course_offerings = await getOfferings();
    res.render("offerings.ejs", {course_offerings})
})

router.get("/instructor", async (req, res) => {
    /*

    getPendingRequests(req.session.userId)
    
    */
   let pending_approvals = [] 
   if(req.session.userType==2) {
    let adApprovals = await getPendingAdvisorApprovals(req.session.userId);
    pending_approvals = [...pending_approvals, ...adApprovals]
   }

    let approvals = await getPendingApprovals(req.session.userId);
    pending_approvals = [...pending_approvals, ...approvals]
    console.log(pending_approvals)
    //const pending_approvals = [{
        //student_name: "Aman",
        //student_entry_number: "2020ceb1004@iitrpr.ac.in",
        //course_name: "Social Computing",
        //id: 1232
    //},
    //{ 
        //course_name: "Introduction to Fantasy and Science Fiction",
        //id: 3412,
        //student_name: "Tyler",
        //student_entry_number: "depprojcsece20@gmail.com",
    //}]
    res.render("instructor.ejs", {approvals: pending_approvals})
})

//const enrollStudent = async (student_id, courseId) => {
//    console.log(`Student ${student_id} is enrolled in ${courseId}`)
//    return "Enrolled"
//}

router.get("/enroll/:courseID", async (req, res) => {
    console.log(req.session)
    let status = await enrollStudent(req.session.userId, req.params.courseID)
    console.log(status)
    return res.render("enroll.ejs", {message: status})
})

const setEnrolmentStatus = (approvalId, status) => {
    console.log(`change ${approvalId} value to ${status}`)
}

router.post('/setEnrolment', (req, res) => {
    const {approval_id, status} = req.body;
    log(`${approval_id} is given status ${status}`)
    if(status==0) setEnrollment(approval_id, 5);
    else setEnrollment(approval_id, req.session.userType)
    res.send("Done")
})