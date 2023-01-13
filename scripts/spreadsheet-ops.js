function findInSheet(email){
    console.log(`Finding ${email} in sheet`)
    return true
}

function getFromSheet(email){
    console.log(`Returning ${email} from sheet`)
    return {"email": email, "userName": email.split('@')[0]}
}


module.exports = {
    findInSheet,
    getFromSheet,
}