const express = require('express')
const app = express()
port = 3000

const log = console.log


app.get('/', (req, res) => {
    return res.send("Hello, World!")
})

app.listen(port, () => {
return log(`Server started at http://localhost:${port}`)
})