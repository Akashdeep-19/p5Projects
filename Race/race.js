var steer = 0.04;
var thrust = 0.05;
var gravity = 0;
var limit = 5;
var brakes = 0.96;
var laps = 1;
var track = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1,0,1,1,1,0,1,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,5];
var grid;
var rows;
var cols;
var finish = [];
var w = 100;
var edit = false;
var started = false;
var timerStarted = false;
var players = [];
var timer = 3;

function make2DArray(rows,cols){
    var arr = new Array(rows+1);
    for(var i=0;i<arr.length;i++){
        arr[i] = new Array(cols+1);    
    }
    return arr;
}

function setup(){
    createCanvas(1000,600);
    rows = floor(height/w);
    cols = floor(width/w);
    grid = make2DArray(cols,rows);
    for(var i=0;i<=cols;i++){
        for(var j=0;j<=rows;j++){
            grid[i][j] = new Cell(i,j);   
        }  
    }
    var blue = color(0,0,255);
    var red = color(255,0,0)
    players[0] = new Player(w/2,rows*w - w/4,blue,45,20);
    players[1] = new Player(w/2,rows*w - 3*w/4,red,45,20);
    if(track.length != 0){
        for(var i=0;i<cols;i++){
            for(var j=0;j<rows;j++){
                grid[i][j].walls[0] = (track[(i*rows+j)*2] == 1)?true:false;
                grid[i][j].walls[1] = (track[(i*rows+j)*2+1] == 1)?true:false;
                finish[0] = track[track.length - 2];
                finish[1] = track[track.length - 1];
            }
        }
        edit = false;
    }
    else
        edit = true;
}

function draw(){
    background(100);
    if(timer < 1)
        started = true;
    for(var i=0;i<=cols;i++){
        for(var j=0;j<=rows;j++){
            grid[i][j].show(); 
            grid[i][j].collide(players[0]);
            grid[i][j].collide(players[1]);
        }  
    }
    if(!edit){
        for(player of players){
            player.show();
            player.update();
        }
    }
    
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
    if(keyIsDown(UP_ARROW) && started){
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
    if(keyIsDown(87) && started){
        players[1].addForce(-thrust);
    }
    if(!edit){
        if(grid[finish[0]][finish[1]].contains(players[0].pos.x,players[0].pos.y)){
            if(!players[0].lapCounted)
                players[0].lap++;
            players[0].lapCounted = true;
        }
        else
            players[0].lapCounted = false;
        if(grid[finish[0]][finish[1]].contains(players[1].pos.x,players[1].pos.y)){
            if(!players[1].lapCounted)
                players[1].lap++;
            players[1].lapCounted = true;
        }
        else
            players[1].lapCounted = false;
    }
    if(players[0].lap > laps){
        noStroke();
        textSize(120);
        fill(0,0,255);
        text('BLUE WINS',width/2,height/2); 
        noLoop();
    }
    if(players[1].lap > laps){
        textSize(120);
        fill(255,0,0);
        text('RED WINS',width/2,height/2); 
        noLoop();
    }
    if(!edit)
        ui();
}

function ui (){
    textAlign(CENTER);
    noStroke();
    if(timerStarted && timer > 0){
        textSize(120);
        fill(255);
        text(timer,width/2,height/2);
    }
    if(timer == 0){
        textSize(120);
        fill(255);
        text('GO',width/2,height/2);
    }
    textSize(60);
    fill(255,0,0,70);
    text(players[1].lap + '/' + laps,width/2-60,60);
    fill(0,0,255,70);
    text(players[0].lap + '/' + laps,width/2+60,60);
}

function timeCount(){
    if(timerStarted)
        timer--;
}
setInterval(timeCount,1000);

function mousePressed(){
    if(edit){
        for(var i=0;i<cols;i++){
            for(var j=0;j<rows;j++){
                grid[i][j].remove(mouseX,mouseY); 
                track[(i*rows+j)*2] = grid[i][j].walls[0]?1:0;
                track[(i*rows+j)*2+1] = grid[i][j].walls[1]?1:0;
            }  
        }
    }
}

function keyPressed(){
    if(keyCode === 13){
        console.log(track);
    }
    if(keyCode === 70){
        if(edit){
            for(var i=0;i<cols;i++){
                for(var j=0;j<rows;j++){
                    if(grid[i][j].contains(mouseX,mouseY)){
                        track[track.length] = i;
                        track[track.length] = j;
                        finish = [i,j];
                    }
                }
            }
        }
    }
    if(keyCode === 32)
        timerStarted = true;
}

function Cell(i,j){
    this.i = i;
    this.j = j;
    this.walls = [true,true]; 
    
    this.show = function(){
        var x = this.i*w;
        var y = this.j*w;
        stroke(255,0,0);
        strokeWeight(5.5);
        if(this.walls[1])
            line(x,y,x,y+w);
        if(this.walls[0])
            line(x,y,x+w,y);
        if(this.i < cols && this.j < rows){
            var nwallv = grid[this.i+1][this.j].walls[1];
            var nwallh = grid[this.i][this.j+1].walls[0];
            if(this.walls[0] && this.walls[1] && nwallh && nwallv){
                noStroke();
                fill(200);
                rect(x,y,w,w);
            }
            if(this.i == finish[0] && this.j == finish[1]){
                noStroke();
                fill(255,255,0);
                rect(x+5,y+5,w-5,w-10);
            }
        }
    }
    
    this.remove = function(x,y){
        var x0 = this.i*w + w/2;
        var y0 = this.j*w;
        var x1 = this.i*w;
        var y1 = this.j*w +w/2;
        var d0 = dist(x,y,x0,y0);
        var d1 = dist(x,y,x1,y1);
        if(d0 < w/4)
            this.walls[0] = false;
        if(d1 < w/4)
            this.walls[1] = false;
    }
    
    this.contains = function(x,y){
        if(x >= this.i*w && x <= this.i*w+w && y >= this.j*w && y <= this.j*w+w)
            return true;
    }
    
    this.collide = function(hit){
        var dx = abs(cos(hit.rot.heading())*hit.l/2) + abs(sin(hit.rot.heading())*hit.b/2);
        var dy = abs(cos(hit.rot.heading())*hit.b/2) + abs(sin(hit.rot.heading())*hit.l/2);
        var x = this.i*w;
        var y = this.j*w;
        if(this.walls[0] && hit.pos.x - x <= w && hit.pos.x - x > 0){
            if(y - hit.pos.y < dy && y-hit.pos.y > 0){
                hit.vel.mult(0);
                hit.pos.y = y - dy;
            }
            if(y - hit.pos.y > -dy && y-hit.pos.y < 0){
                hit.vel.mult(0);
                hit.pos.y = y + dy;
            }
        }
        if(this.walls[1] && hit.pos.y - y <= w && hit.pos.y - y > 0){
            if(x - hit.pos.x < dx && x-hit.pos.x > 0){
                hit.vel.mult(0);
                hit.pos.x = x - dx;
            }
            if(x - hit.pos.x > -dx && x-hit.pos.x < 0){
                hit.vel.mult(0);
                hit.pos.x = x + dx;
            }
        }
    }
}