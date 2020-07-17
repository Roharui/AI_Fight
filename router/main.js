
const fs = require('fs')

module.exports = function(app) {

    app.get('/', (req, res) => {
        res.set('Content-type', 'text/html')
        let html = fs.readFileSync("./views/index.html")
        res.send(html)
    })
}