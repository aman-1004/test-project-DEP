const {log, str, getIP} = require('./helper')
const debugRoute = (req, res, next) => {
    log(req.method + " " + req.url)
    let query = str(req.query)
    let form = str(req.body)
    if(query !== "{}") log("Query: " + query);
    if(form !== "{}") log("Form: " + form);
    next();
}

let limit = {}
const checkLogin = (req, res, next) => {
    let ip = getIP(req)
    if(!limit[ip]) limit[ip]=0
    log(limit[ip])
    let session = req.session
    log(session)
    if(session.email || req.url.substr(0, 6) == "/login" ) 
        return next()
    res.redirect('/login')
}

const rateLimit = (req, res, next) => {
    let ip = getIP(req)
    if(limit[ip]>15) return res.redirect("/ratelimit")
    limit[ip]++; 
    next()
}

module.exports = {
    debugRoute,
    checkLogin,
    rateLimit,
}
