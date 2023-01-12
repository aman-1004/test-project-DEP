const log = console.log
const str = JSON.stringify

const debugRoute = (req, res, next) => {
    log(req.method + " " + req.url)
    let query = str(req.query)
    let form = str(req.body)
    if(query !== "{}") log("Query: " + query);
    if(form !== "{}") log("Form: " + form);
    next();
}

const checkLogin = (req, res, next) => {
    let session = req.session
    log(session)
    if(session.email || req.url == "/login") 
        return next()
    res.redirect('/login')
}


module.exports = {
    debugRoute,
    checkLogin,
}
