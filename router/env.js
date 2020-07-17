
const fs = require('fs')

function getRandomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function createArray(size) {
    let result = []

    for(let i = 0; i < size[0]; i++){
        let x = new Array(size[1])
        x.fill(0)
        result.push(x)
    }

    return result
}

function User(id, loc){
    this.id = id
    this.cur = 1
    this.loc = loc
    this.hp = 20
}

module.exports = function(app) {

    this.config = JSON.parse(fs.readFileSync('./config/config.json'))

    let stage_size = this.config.stage_size

    this.stage = createArray(stage_size)

    this.stageShow = function(){
        let s = JSON.parse(JSON.stringify(this.stage))

        this.users.forEach(u => {
            let {x , y} = u.loc
            s[y][x] = 1
        })

        return s
    }

    this.user_count = 0

    this.users = []

    this.getRandomPlace = function() {

        let s = this.stageShow()

        let x = 0;
        let y = 0;

        do {
            x = getRandomInt(0, stage_size[1])
            y = getRandomInt(0, stage_size[0])
        }while(s[y][x] != 0)

        return {x : x, y : y}

    }
    
    app.get('/join', (req, res) => {
        let data = { id : this.user_count++ }

        let loc = this.getRandomPlace()

        this.user.push(new User(id, loc))

        res.send({data : data , stage : this.stageShow(), loc : loc})
    })

}