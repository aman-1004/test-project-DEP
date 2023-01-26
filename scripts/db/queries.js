const pool = require("./db");

function execute(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, res) => {
      if (err) reject(err);
      else resolve(res.rows);
    });
  });
}

function checkStudent(emailID) {
  let query = `SELECT s.id as student_id, s.name, s.email_id FROM student s WHERE s.email_id=$1`;
  return execute(query, [emailID]);
}

// checkStudent("2020ceb1004@iitrpr.ac.in").then((rows) => console.log(rows));

function checkInstructor(emailID) {
  let query = `SELECT  s.name,s.isadvisor,s.id as instructor_id FROM instructor s WHERE s.email_id=$1`;
  return execute(query, [emailID]);
}

async function getUser(emailID){
  let isStudent = await checkStudent(emailID);
  
  if(isStudent.length==0) {
    let isTeacher = await checkInstructor(emailID);
    if(isTeacher.length != 0) { 
      return {
      name: isTeacher[0].name,
      id: isTeacher[0].instructor_id,
      userType: (isTeacher[0].isadvisor? 2:1),
    };
    
  }
  } 
  else return {
    name: isStudent[0].name,
    id: isStudent[0].student_id,
    userType: 0,
  };
  return {};
}

// getUser('2020ceb1005@iitrpr.ac.in').then(rows => console.log(rows))
// checkInstructor("2020ceb1005@iitrpr.ac.in").then((rows) => console.log(rows));

async function checkStudentEnroll(student_id, course_id) {
  let checkEnrol = `SELECT s.status FROM enrolment_status s WHERE s.student_id=$1 AND s.course_id=$2`;
  return (await execute(checkEnrol, [student_id, course_id])).length != 0;
}

async function enrollStudent(student_id, course_id) {
  let insertEnrol = `INSERT INTO enrolment_status (course_id,student_id,status) VALUES ($1,$2,0)`;
  if ((await checkStudentEnroll(student_id, course_id)) == false) {
    console.log("Enrolling student");
    try {
      await execute(insertEnrol, [course_id, student_id]);
      return "Added enrollment request. Instructor and Advisor approval is still required"
    }
    catch {
      return "Unexpected Error"
    }
  } else {
    return "Student is already enrolled or rejected by the instructor";
  }
}

// enrollStudent(1, 1);

function getPendingCourses(student_id) {
  let query = `SELECT c.course_name as courseTitle,
  i.name as instructorName,
  e.status as status
FROM enrolment_status e
  LEFT JOIN course c ON c.id = e.course_id
  LEFT JOIN instructor i ON i.id = c.instructor_id
where e.student_id = $1 AND e.status != 2`;
  return execute(query, [student_id]);
}
// getPendingCourses(2).then((x) => console.log(x));

function getEnrolledCourses(student_id) {
  let query = `SELECT c.course_name as courseTitle,
  i.name as instructorName,
  e.status as status
FROM enrolment_status e
  LEFT JOIN course c ON c.id = e.course_id
  LEFT JOIN instructor i ON i.id = c.instructor_id
where e.student_id = $1 AND e.status=2`;
  return execute(query, [student_id]);
}

// getEnrolledCourses(2).then((x) => console.log(x));

function getOfferings() {
  let query = `SELECT c.id,
  c.course_name as title,
  i.id as instructor_id,
  i.name as instructor_name
FROM course c
  LEFT JOIN instructor i ON c.instructor_id = i.id
`;
  return execute(query, []);
}

// getOfferings().then(x=>console.log(x));

function setEnrollment(approval_id, status) {
  const query = `UPDATE enrolment_status
  SET status=$2
  WHERE id=$1`;
  return execute(query, [approval_id, status]);
}

// setEnrollment(1, 2);

function getPendingApprovals(instructor_id) {
  let query = `SELECT s.name as student_name,
  s.entry_number as student_entry_number,
  c.course_name as course_name,
  e.id
FROM enrolment_status e
  INNER JOIN course c ON c.id = e.course_id
  INNER JOIN student s ON s.id = e.student_id
where c.instructor_id = $1 AND
  e.status = 0`;
  return execute(query, [instructor_id]);
}

function getPendingAdvisorApprovals(advisor_id){
  let query = `SELECT s.name as student_name,
  s.entry_number as student_entry_number,
  c.course_name as course_name,
  e.id
FROM enrolment_status e
  INNER JOIN course c ON c.id = e.course_id
  INNER JOIN student s ON s.id = e.student_id
  INNER JOIN program p ON p.id = s.program_id
  where p.advisor_id = $1
  AND e.status = 1`;
  return execute(query, [advisor_id]);
}

getPendingAdvisorApprovals(4).then((x) => console.log(x)).catch(e => console.log(e));

module.exports = {
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
}