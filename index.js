
const express = require('express')

const app = express()

const http = require('http').createServer(app)

const io = require('socket.io')(http)

const port = 5555

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

const main = require('./router/main')(app)

const evn = require('./router/env')(app, io)

http.listen(port, () => {console.log(`Server listening at : ${port}`)})