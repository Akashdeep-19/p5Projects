var players = [];
var ball;
var steer = 0.04;
var thrust = 3;
var gravity = 0;
var limit = 4;
var brakes = 0.98;
var goalHeight = 100;
var goalWidth = 50;
var redScore = 0;
var blueScore = 0;
var timer = 0;
var time = 150;

function setup(){
    var red = color(255,0,0,100);
    var blue = color(0,0,255,100);
    createCanvas(windowWidth-5,windowHeight-5);
    players[0] = new Player(width*0.75,height/2,blue,70,30);
    players[1] = new Player(width*0.25,height/2,red,70,30);
    ball = new Ball();
    timer = time;
}
function draw(){
    background(100);
    for(player of players){
        player.show();
        player.update();
        player.restrict();
        player.hit(ball.pos.x,ball.pos.y,ball);
    }
    players[0].hitP(players[1]);    
    ball.show();
    ball.update();
    ball.restrict(ball);
    rectMode(CENTER);
    fill(255,0,0,100);
    rect(0,height/2,goalWidth,goalHeight);
    fill(0,0,255,100)
    rect(width,height/2,goalWidth,goalHeight);
    fill(255,100);
    rect(width,height/2,goalWidth,height);
    rect(0,height/2,goalWidth,height);
    
    
    
    if(keyIsDown(LEFT_ARROW)){
        players[0].steer(-steer);
    }
    if(keyIsDown(RIGHT_ARROW)){
        players[0].steer(steer);
    }
    if(keyIsDown(DOWN_ARROW)){
        players[0].brake(brakes);
    }
    else
        players[0].brakes = false;
    if(keyIsDown(UP_ARROW)){
        players[0].addForce(-thrust);
    }
    if(keyIsDown(65)){
        players[1].steer(-steer);
    }
    if(keyIsDown(68)){
        players[1].steer(steer);
    }
    if(keyIsDown(83)){
        players[1].brake(brakes);
    }
    else
        players[1].brakes = false;
    if(keyIsDown(87)){
        players[1].addForce(-thrust);
    }
    ui();
}
//function keyPressed(){
//    
//    if(keyCode === UP_ARROW){
//        players[0].;
//    }
//    if(keyCode === 87){
//        players[1].;
//    }
//}

function ui(){
    textAlign(CENTER);
    textSize(60);
    fill(255,0,0,100);
    text(blueScore,width/2-80,50);
    fill(0,0,255,100);
    text(redScore,width/2+80,50);
    fill(255,100);
    text(timer,width/2,50);
    if(timer<0){
        if(blueScore>redScore){
            fill(255,0,0);
            text("RED WINS",width/2,height/2-50);
        }
        else if(blueScore<redScore){
            fill(0,0,255);
            text("BLUE WINS",width/2,height/2-50);
        }
        else{
            fill(255);
            text("DRAW",width/2,height/2-50);
        }
        noLoop();
    }
}
function timeCount(){
    timer--;
}
setInterval(timeCount,1000);


function Ball(){
    this.pos = createVector(width/2,height/2);
    this.vel = createVector();
    this.acc = createVector();
    this.friction = 0.994;
    this.r = 15;
    
    this.update = function(){
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.limit(6);
        this.vel.mult(this.friction);
    }
    this.show = function(){
        fill(255,0,0);
        ellipse(this.pos.x,this.pos.y,this.r*2);
    }
    this.shot = function(playr){
        if(p5.Vector.dist(playr.pos,this.pos) <= this.r){
            this.vel = playr.vel.copy();
            playr.vel.mult(-0.7);
        } 
    }
    this.restrict = function(object){
        var x1 = 0;
        if(object.pos.y+this.r<=height/2+goalHeight/2 && object.pos.y-this.r>=height/2-goalHeight/2){
            x1 = 0;
            if(this.pos.x > width-goalWidth/2){
                blueScore++;
                this.pos.set(width/2,height/2);
                players[0].pos.set(0.75*width,height/2);
                players[1].pos.set(0.25*width,height/2);
                players[0].vel.set(0,0);
                players[1].vel.set(0,0);
                this.vel.set(0,0);
            }
            if(this.pos.x < goalWidth/2){
                redScore++;
                this.pos.set(width/2,height/2);
                players[0].pos.set(0.75*width,height/2);
                players[1].pos.set(0.25*width,height/2);  
                players[0].vel.set(0,0);
                players[1].vel.set(0,0);
                this.vel.set(0,0);
            }
        }
        else
            x1 = goalWidth/2;
        if(object.pos.y+this.r > height || object.pos.y-this.r < 0){
            this.vel.y *= -1;
        }
        if(object.pos.x+this.r > width-x1 || object.pos.x-this.r < x1){
            this.vel.x *= -1;
            if(x1 === 0){
                if(object.pos.y+this.r>=height/2+goalHeight/2 && object.pos.y-this.r<=height/2-goalHeight/2)
                    this.vel.y *= -1;       
            }
        }
    }
}