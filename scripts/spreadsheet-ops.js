const { response } = require("express");
require('dotenv').config()

async function findInSheet(email){
    return (await getFromSheet(email)).found
}

async function getFromSheet(email){
    var formdata = new FormData();
    formdata.append("email", email);

    var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
    };

    let response = await fetch(process.env.SHEET_URL, requestOptions)
    try {
        return (await response.json())
    }
    catch {
        return {
            found: false, email: "", userName: ""
        }
    }
}

module.exports = {
    findInSheet,
    getFromSheet,
}