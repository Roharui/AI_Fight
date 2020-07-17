
var canvas = null

var ctx = null

const Env = {
    stage : null,
    id : 0,
    ata : null,
    clear(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    reset() {
        this.clear()
        if(this.ata == null || this.ata == undefined) {}
        else { this.drawAta(this.ata) }
        this.stage.forEach((y, i) => {
            y.forEach((x, j) => {
                if(x > 0){

                    centerX = j * 50 + 25
                    centerY = i * 50 + 25

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);

                    if(x == 1){
                        ctx.lineTo(centerX, centerY - 25);
                    } else if(x == 2){
                        ctx.lineTo(centerX + 25, centerY); 
                    } else if(x == 3){
                        ctx.lineTo(centerX, centerY + 25);
                    } else if(x == 4){
                        ctx.lineTo(centerX - 25, centerY);                 
                    }

                    ctx.stroke();
                }
            })
        })

        this.drawGrid()
    },
    join(){
        $.ajax({
            url : '/join',
            type: 'post',
            success : function(data){
                Env.stage = data.stage
                Env.id = data.id

                Env.reset()
            }
        })
    },
    drawGrid(){
        for(let i = 0; i < 10 ; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 50);
            ctx.lineTo(500, i * 50);
            ctx.stroke();
        }

        for(let i = 0; i < 10 ; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 50, 0);
            ctx.lineTo(i * 50, 500);
            ctx.stroke();
        }
    },
    doAction(action){
        $.ajax({
            url : '/action',
            type: 'POST',
            dataType: "json",
            data : {
                id : this.id,
                action : action
            },
            success : function(data){
                console.log(data)
                Env.stage = data.stage
                Env.id = data.id
                Env.ata = data.attack_area

                Env.reset()
            }
        })
    },
    drawAta(ata){
        ctx.fillStyle = "green"
        ata.forEach((y, i) => {
            y.forEach((x, j) => {
                if(x != null){
                    ctx.fillRect(j * 50, i * 50, 50, 50)
                }
            })
        })
    }
}

$(document).ready(function() {
    canvas = document.getElementById("main")

    ctx = canvas.getContext("2d");

    Env.join()
})

