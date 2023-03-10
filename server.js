global.__basedir = __dirname

const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const {checkLogin, debugRoute} = require('./scripts/middlewares') 
require('dotenv').config()

port = 3000
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {maxAge: 60*60*24*1000},
    resave: false
}))
app.use(checkLogin)
app.use(debugRoute)
app.use(require('./scripts/routes'))



 
app.listen(port, () => {
    return console.log(`Server started at http://localhost:${port}`)
})