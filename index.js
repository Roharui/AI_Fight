
const express = require('express')

const app = express()

const fs = require('fs')

const main = require('./router/main')(app)

const evn = require('./router/env')(app)

const port = 5555

app.use(express.static(__dirname + '/public'))
console.log(__dirname)

app.listen(port, () => {console.log(`Server listening at : ${port}`)})