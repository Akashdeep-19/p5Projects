var turn = 0.03;
var delay = 50;
var totalTime = 100;
var players = [];
var balls = [];
time = 0;
var blueScore = 0;
var redScore = 0;

function setup (){
    createCanvas(800,600);
    timer = totalTime;
    var blue = color(0,0,255);
    var red = color(255,0,0);
    players[0] = new Player(7*width/8,4*height/5,blue);
    players[1] = new Player(width/8,4*height/5,red);
}

function draw (){
    background(100);
    for(player of players){
        player.show();
        player.bulletUpdate();
    }
    for(ball of balls){
        ball.show();
        ball.update();
        ball.restrict();
    }
    
    spawn();
    ui();
    
    for(var i = balls.length-1;i >= 0;i--){
        if(balls[i].hit)
            balls.splice(i,1);
    }
    
    if(keyIsDown(LEFT_ARROW)){
        players[0].aim(-turn);
    }
    if(keyIsDown(RIGHT_ARROW)){
        players[0].aim(turn);
    }
    if(keyIsDown(65)){
        players[1].aim(-turn);
    }
    if(keyIsDown(68)){
        players[1].aim(turn);
    }
}

function keyPressed (){
    if(keyCode === UP_ARROW){
        players[0].shoot();
    }
    if(keyCode === 87){
        players[1].shoot();
    }
}

function ui (){
    stroke(255);
    strokeWeight(3);
    line(width/4,0,width/4,height);
    line(3*width/4,0,3*width/4,height);
    textAlign(CENTER);
    strokeWeight(1);
    textSize(60);
    fill(255,0,0,100);
    text(players[1].score,width/8,50);
    fill(0,0,255,100);
    text(players[0].score,7*width/8,50);
    fill(255,100);
    text(timer,width/2,50);
    if(timer<0){
        if(players[1].score>players[0].score){
            fill(255,0,0);
            text("RED WINS",width/2,height/2-50);
        }
        else if(players[1].score<players[0].score){
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


function spawn (){
    time++;
    if(time % delay == 0){
        balls.push(new Ball());
    }
}

function Player (x,y,color){
    this.x = x;
    this.y = y;
    this.l = 70;
    this.b = 30;
    this.rot = createVector(0,1);
    this.bullets = [];
    this.score = 0;
    
    this.show = function(){
        push();
        rectMode(CENTER);
        stroke(255);
        strokeWeight(1);
        fill(color);
        translate(this.x,this.y);
        rotate(this.rot.heading());
        rect(this.l/2-this.b/2,0,this.b,this.b);
        fill(220,100);
        rect(0,0,this.l,this.b);
        stroke(255,100);
        strokeWeight(4);
        line(-this.l/2,0,-this.l,0);
        pop();
    }
    
    this.bulletUpdate = function(){
        for(bullet of this.bullets){
            bullet.show();
            bullet.update();
            bullet.restrict();
            for(ball of balls)
                bullet.struck(ball);
        }
        for(var i = this.bullets.length-1;i >= 0;i--){
            if(this.bullets[i].hit)
                this.bullets.splice(i,1);
        }
        
    }
    
    this.aim = function(turn){
        this.rot.rotate(turn);
    }
    
    this.shoot = function(){
        var dx = cos(this.rot.heading())*this.l/2;
        var dy = sin(this.rot.heading())*this.l/2;
        this.bullets.push(new Bullet(this.x-dx,this.y-dy,color,this.rot,this));   
    }
}

function Bullet (x,y,color,rot,p){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.speed = 10;
    this.vel = rot.copy();
    this.vel.setMag(-this.speed);
    this.hit = false;
    
    this.update = function (){
        this.pos.add(this.vel);
    }
    
    this.show = function(){
        fill(color);
        noStroke();
        ellipse(this.pos.x,this.pos.y,10);
    }
    
    this.struck = function(ball){
        var d = dist(this.pos.x,this.pos.y,ball.pos.x,ball.pos.y);
        if(d < ball.r){
            this.hit = true;
            ball.hit = true;
            p.score++;
        }
    }
    this.restrict = function(){
        if(this.pos.y > height || this.pos.y < 0 || this.pos.x > width || this.pos.x < 0){
            this.hit = true;
        }   
    }
}

function Ball (){
    var y = random()<0.3?5:height-5;
    var x = random(width/4,3*width/4);
    this.speed = 4;
    this.hit = false;
    this.r = 20
    this.pos = createVector(x,y);
    this.vel = p5.Vector.random2D();
    this.vel.setMag(this.speed);
    
    this.update = function(){
        this.pos.add(this.vel);
    }
    
    this.show = function(){
        fill(255,255,0);
        stroke(0);
        strokeWeight(2);
        ellipse(this.pos.x,this.pos.y,this.r*2);
    }
    
    this.restrict = function(){
        if(this.pos.x > 3*width/4){
            this.pos.x = 3*width/4;
            this.vel.x *= -1;
        }
        if(this.pos.x < width/4){
            this.pos.x = width/4;
            this.vel.x *= -1;
        }
        if(this.pos.y > height || this.pos.y < 0){
            this.hit = true;
        }
    }
}