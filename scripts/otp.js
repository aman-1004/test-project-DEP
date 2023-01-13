require('dotenv').config()

async function sendOTP(email, otp){
    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append("body", otp);

    var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
    };

    await fetch(process.env.OTP_URL, requestOptions)
    console.log(`OTP: ${otp} is sent to ${email}`)
}

module.exports = {
    sendOTP
}