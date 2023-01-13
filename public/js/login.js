console.log("Sourcing index.js")
let forms = document.querySelectorAll('form')
let form1 = forms[0]
let form2 = forms[1]
let email = undefined
let otp = undefined
form1.onsubmit = async (e) => {
    e.preventDefault()
    const input = form1.querySelector('input')
    if(input.value.trim() == ""){
        alert("Enter your email")
        return false;
    }
    email = input.value.trim().toLowerCase()
    let response = await fetch('/login/genOTP', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email 
        })
    })
    response = await response.text()
    form1.hidden = true
    form2.hidden = false 
    console.log(response)
}
form2.onsubmit = async (e) => {
    e.preventDefault()
    const input = form2.querySelector('input')
    if(input.value.trim() == ""){
        alert("Enter OTP")
        return false;
    }
    otp = input.value.trim().toLowerCase()
    let response = await fetch('/login/verifyOTP', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "otp": otp
        })
    })
    
    let status = await response.status
    if(status == 200) {
        window.location.replace('/')
    }
    else {
        alert("OTP does not match")
    }
}
// let regenButton = document.querySelector('button#regenOTP')
// regenButton.addEventListener('click',  async (e) => {
//     let response = await fetch('/login/genOTP', {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             "email": email 
//         })
//     })
//     response = await response.text()
// })