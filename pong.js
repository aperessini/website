var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
canvas.style.borderRadius = "20px";
var context = canvas.getContext('2d');
var playerName = getPlayerName();
var computerName = "Computer";

window.onload = function(){

    document.body.appendChild(canvas);
    animate(step);
}

window.addEventListener("keyup", event =>{
    if(event.code === "Space" && ball.x_speed == 0 && ball.y_speed == 0){
        var plusOrMinus = Math.round(Math.random()) * 2 - 1;
        ball.x_speed = plusOrMinus * Math.random() * 3;
        if(ball.x_speed < 1 && ball.x_speed > -1){
            ball.x_speed = 1 * plusOrMinus;
        }
        ball.y_speed = plusOrMinus * Math.random() * 3;
        if(ball.y_speed < 0.5 && ball.y_speed > -0.5){
            ball.y_speed = 0.5 * plusOrMinus;
        }
    }
})

var step = function(){

    update();
    render();
    animate(step);
}

var update = function(){
    player.update();
    computer.update(ball);
    ball.update(computer.paddle, player.paddle);
}

var render = function(){

    context.fillStyle = "black"; //"#E29CD2";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.textAlign = "end";
    context.fillText(playerName, 575, 50, 175);
    context.fillText(player.score, 400, 50, 50);
    context.textAlign = "start";
    context.fillText(computerName, 25, 50, 175);    
    context.fillText(computer.score, 200, 50, 50);
    player.render();
    computer.render();
    ball.render();
}

function Paddle(x, y, width, height){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function(){

    context.fillStyle = "#66FF66";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y){
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;

    if(this.y < 0){
        this.y = 0;
        this.y_speed = 0;
    }
    else if(this.y + this.height > 400){
        this.y = 400 - this.height;
        this.y_speed = 0;
    }
};

function Player(){

    this.paddle = new Paddle(575, 175, 10, 50);
    this.score = 0;
}

function Computer(){

    this.paddle = new Paddle(15, 175, 10, 50);
    this.score = 0;
}       

Player.prototype.render = function(){
    this.paddle.render();
};

Player.prototype.update = function(){
    for(var key in keysDown){
        if(Number(key) == 38){
            this.paddle.move(0, -5);
        }
        else if(Number(key) == 40){
            this.paddle.move(0, 5);
        }
        else{
            this.paddle.move(0, 0);
        }
    }
};

Computer.prototype.render = function(){
    this.paddle.render();
};

Computer.prototype.update = function(ball){
    var y_pos = ball.y;
    var diff = -(this.paddle.y + this.paddle.height/2 - y_pos);
    if(diff > 4){
        diff = 5;
    }
    else if(diff < -4){
        diff = -5;
    }
    this.paddle.move(0, diff);
    if(this.paddle.y < 0){
        this.paddle.y = 0;
    }
    else if(this.paddle.y + this.paddle.height > 400){
        this.paddle.y = 400 - this.paddle.height;
    }
};

function Ball(x, y){

    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 0;
    this.radius = 5;
}

Ball.prototype.render = function(){

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2* Math.PI, false);
    context.fillStyle = "white"; //"#000000";
    context.fill();
}

Ball.prototype.update = function(paddle1, paddle2){

    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if(this.y - 5 < 0){
        this.y = 5;
        this.y_speed = -this.y_speed;
    }
    else if(this.y + 5 > 400){
        this.y = 395;
        this.y_speed = -this.y_speed;
    }

    if(this.x < 0 || this.x > 600){ //point is scored
        
        this.x < 600 ? ++player.score : ++computer.score;

        this.x_speed = 0;
        this.y_speed = 0;
        this.x = 300;
        this.y = 200;
    }

    if(top_x < 300) {
        if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
          // hit the player's paddle
          this.x_speed = 3;
          this.y_speed += (paddle1.y_speed / 2);
          this.x += this.x_speed;
        }
      } 
    else {
        if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
          // hit the computer's paddle
          this.x_speed = -3;
          this.y_speed += (paddle2.y_speed / 2);
          this.x += this.x_speed;
        }
      }
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


function getPlayerName(){

    var name = "";

    while(!name){
        name = window.prompt("Enter player name", "Acorn");

        if(!name){
            alert("Player must have name.");
        }
    }

    return name;
}



