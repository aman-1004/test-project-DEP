const log = console.log
const str = JSON.stringify

function generateOTP(){
    return Math.floor(1000 + Math.random() * 9000)
}
function getIP(req){
    return req.headers['x-forwarded-for']?.split(',').shift()|| req.socket?.remoteAddress 
}
module.exports = {
    log,
    str,
    generateOTP,
    getIP,
}