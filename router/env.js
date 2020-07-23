
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('./config/config.json'))

const state_size = config.state_size

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

let state = createArray(state_size)

let ata = createArray(state_size)

function stateShow(){
    let s = state.map(x => {
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

    let s = stateShow()

    let x = 0;
    let y = 0;

    try{
        do {
            x = getRandomInt(0, state_size[1] - 1)
            y = getRandomInt(0, state_size[0] - 1)
        }while(s[y][x] != 0)
    } catch(e) {
        console.log({x : x, y : y})
        return 'Error!'
    }
    return {x : x, y : y}
}

function clear(){
    users = []
    state = createArray(state_size)
    ata = createArray(state_size)
    user_count = 0
}

function User(id, loc){
    this.id = id
    this.cur = getRandomInt(1, 4)
    this.loc = loc
    this.score = 0

    this.action = (action) => {
        ata = createArray(state_size)
        if(action == 0)
            this.move()
        else if(action == 5)
            this.attack()
        else
            this.cur = action
            this.move()
    }

    this.move = () => {
        state[this.loc.y][this.loc.x] = null
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
            this.loc = ori_loc
            state[this.loc.y][this.loc.x] = this
            this.score -= 3
        }else if(state[this.loc.y][this.loc.x] != null){
            this.loc = ori_loc
            state[this.loc.y][this.loc.x] = this
            this.score -= 1
        } else{
            state[this.loc.y][this.loc.x] = this
        }
    }

    this.attack = () => {
        let count = 0
        if(this.cur == 1){
            state.forEach((x, i) => {
                if(i >= this.loc.y) return

                ata[i][this.loc.x] = 1

                if (x[this.loc.x] != null) {
                    x[this.loc.x].score -= 1
                    count += 1
                }
            })
        } else if (this.cur == 2) {
            state[this.loc.y].forEach((x, i) => {
                if(i <= this.loc.x) return

                ata[this.loc.y][i] = 1

                if(x != null){
                    x.score -= 1
                    count += 1
                }
            })
        } else if (this.cur == 3) {
            state.forEach((x, i) => {
                if(i <= this.loc.y) return

                ata[i][this.loc.x] = 1

                if (x[this.loc.x] != null) {
                    x[this.loc.x].score -= 1
                    count += 1
                }
            })
        } else if (this.cur == 4) {
            state[this.loc.y].forEach((x, i) => {
                if(i >= this.loc.x) return

                ata[this.loc.y][i] = 1

                if(x != null){
                    x.score -= 1
                    count += 1
                }
            })
        }
        this.score += count
    }
}

module.exports = function(app, io) {
    
    app.post('/join', (req, res) => {
        let id = user_count++

        let loc = getRandomPlace()

        let user = new User(id, loc)

        users.push(user)

        state[loc.y][loc.x] = user

        io.emit('state',  {state : stateShow(), attack_area : ata, users : users})

        res.send({id : id , state : stateShow(), loc : loc})
    })

    app.post('/action', (req, res) => {
        let action = parseInt(req.body.action)
        let id = parseInt(req.body.id)

        let x = users.find(x => x.id == id)

        x.action(action)

        io.emit('state',  {state : stateShow(), attack_area : ata, users : users})

        res.send({id : id , state : stateShow(), attack_area : ata, loc : x.loc})
    })

    app.post('/score', (req, res) => {
        let data = users.map((x, i) => {
            let s = x.score
            x.score = 0
            return s
        })

        res.send({score : data})
    })

    app.post('/clear', (req, res) => {
        clear()
        res.send({})
    })

}