
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('./config/config.json'))

const stage_size = config.stage_size

function getRandomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function createArray(size) {
    let result = []

    for(let i = 0; i < size[0]; i++){
        let x = new Array(size[1])
        x.fill(null)
        result.push(x)
    }

    return result
}

let stage = createArray(stage_size)

let ata = createArray(stage_size)

function stageShow(){
    let s = stage.map(x => {
        return x.map(y => {
            return y == null? 0 : y.cur
        })
    })

    // users = users.filter(x => this.hp != 0)

    // users.forEach(u => {
    //     let {x , y} = u.loc
    //     s[y][x] = u.cur
    // })

    return s
}

let user_count = 0

let users = []

function getRandomPlace() {

    let s = stageShow()

    let x = 0;
    let y = 0;

    try{
        do {
            x = getRandomInt(0, stage_size[1] - 1)
            y = getRandomInt(0, stage_size[0] - 1)
        }while(s[y][x] != 0)
    } catch(e) {
        console.log({x : x, y : y})
        return 'Error!'
    }
    return {x : x, y : y}
}

function clear(){
    users = []
    stage = createArray(stage_size)
    ata = createArray(stage_size)
    user_count = 0
}

function User(id, loc){
    this.id = id
    this.cur = getRandomInt(1, 4)
    this.loc = loc
    this.hp = 3

    this.action = (action) => {
        ata = createArray(stage_size)
        if(action == 0)
            return this.move()
        if(action == 5)
            return this.attack()
        
        this.cur = action
        return 0
    }

    this.move = () => {
        stage[this.loc.y][this.loc.x] = null
        let ori_loc = JSON.parse(JSON.stringify(this.loc))
        if(this.cur == 1){
            this.loc.y -= 1
        } else if(this.cur == 2){
            this.loc.x += 1
        } else if(this.cur == 3){
            this.loc.y += 1
        } else if(this.cur == 4){
            this.loc.x -= 1
        }

        if(this.loc.x > 9 || this.loc.y > 9 || this.loc.x < 0 || this.loc.y < 0){
            this.hp = 0
            this.loc = ori_loc
            stage[this.loc.y][this.loc.x] = this
            return -10
        }

        if(stage[this.loc.y][this.loc.x] != null){
            this.loc = ori_loc
            stage[this.loc.y][this.loc.x] = this
            return -3
        }

        stage[this.loc.y][this.loc.x] = this
        return 0
    }

    this.attack = () => {
        let count = 0
        if(this.cur == 1){
            stage.forEach((x, i) => {
                if(i >= this.loc.y) return

                ata[i][this.loc.x] = 1

                if (x[this.loc.x] != null) {
                    x[this.loc.x].hp -= 1
                    count += 1
                }
            })
        } else if (this.cur == 2) {
            stage[this.loc.y].forEach((x, i) => {
                if(i <= this.loc.x) return

                ata[this.loc.y][i] = 1

                if(x != null){
                    x.hp -= 1
                    count += 1
                }
            })
        } else if (this.cur == 3) {
            stage.forEach((x, i) => {
                if(i <= this.loc.y) return

                ata[i][this.loc.x] = 1

                if (x[this.loc.x] != null) {
                    x[this.loc.x].hp -= 1
                    count += 1
                }
            })
        } else if (this.cur == 4) {
            stage[this.loc.y].forEach((x, i) => {
                if(i >= this.loc.x) return

                ata[this.loc.y][i] = 1

                if(x != null){
                    x.hp -= 1
                    count += 1
                }
            })
        }
        return count == 0?-1:count
    }
}

module.exports = function(app, io) {
    
    app.post('/join', (req, res) => {
        let id = user_count++

        let loc = getRandomPlace()

        let user = new User(id, loc)

        users.push(user)

        stage[loc.y][loc.x] = user

        res.send({id : id , stage : stageShow(), loc : loc})
    })

    app.post('/action', (req, res) => {
        let action = parseInt(req.body.action)
        let id = parseInt(req.body.id)

        let x = users.find(x => x.id == id)

        let score = x.action(action)

        io.emit('stage',  {stage : stageShow(), attack_area : ata})

        res.send({id : id , stage : stageShow(), attack_area : ata, loc : x.loc, score : score})
    })

    app.post('/clear', (req, res) => {
        clear()
        res.send({})
    })

}