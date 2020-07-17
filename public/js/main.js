
var canvas = null

var ctx = null

const Env = {
    stage : null,
    id : null,
    reset() {
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

                    console.log(x)

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
            type: 'get',
            success : function(data){
                Env.stage = data.stage
                Env.id = data.data.id

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
    }
}

$(document).ready(function() {
    canvas = document.getElementById("main")

    ctx = canvas.getContext("2d");

    Env.join()
})

