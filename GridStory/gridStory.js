var grid;
var w = 30;
var rows = 600/w;
var spawnTime = 40;
var player;
var bullets = [];
var enemies = [];
var blocks = [];
var bombs = [];
var score = 0;
var highScore = 0;

function make2DArray(rows,cols){
    var arr = new Array(rows);
    for(var i=0;i<arr.length;i++){
        arr[i] = new Array(cols);    
    }
    return arr;
}

function setup(){
    createCanvas(601,601);
    player = new Player();
    for(var i=0;i<10;i++){
        enemies[i] = new Enemy();
        enemies[i].spawn();
    }
    for(var i=0;i<20;i++){
        blocks[i] = new Block();
    }
    frameRate(30);
}
function draw(){
    background(0);
    for(var j=0;j<rows;j++){
        for(var i=0;i<rows;i++){
            fill(240);
            stroke(0);
            strokeWeight(1);
            rect(i*w,j*w,w,w);   
        }  
    }
    player.show();
    player.attacked(10);
    for(var enemy of enemies){
        enemy.show();
        enemy.move();
        enemy.attacked(30);
    }
    for(var i=0;i<bullets.length;i++){
        bullets[i].show();
        bullets[i].move(player.x,player.y);
    }
    for(var i=bombs.length-1;i>=0;i--){
        bombs[i].show();
        bombs[i].move(player.x,player.y);
        bombs[i].damage(enemies,110);
    }
    for(var i=0;i<blocks.length;i++){
        blocks[i].show();
        blocks[i].hit();
        blocks[i].attacked(1);
    }
    if(bullets.length > 15){
        bullets.splice(0,2);
    }
    if(score%spawnTime === 0){
        enemies.push(new Enemy());
        enemies[enemies.length-1].spawn();
    }
    if(player.health < 0){
        if(score > highScore)
            highScore = score;
        console.log("SCORE : "+score);
        console.log("HIGH SCORE : "+highScore);
        noLoop();
    }
    for(var i = enemies.length - 1;i>=0;i--){
        if(enemies[i].health < 0)
            enemies.splice(i,1);
    }
    for(var i = blocks.length - 1;i>=0;i--){
        if(blocks[i].health < 0)
            blocks.splice(i,1);
    }
    score++;
    
//    if(keyIsDown(LEFT_ARROW)){
//        player.move(-1,0);
//    }
//    if(keyIsDown(RIGHT_ARROW)){
//        player.move(1,0);
//    }
//    if(keyIsDown(DOWN_ARROW)){
//        player.move(0,1);
//    }
//    if(keyIsDown(UP_ARROW)){
//        player.move(0,-1);
//    }
}
function keyPressed(){
    
    if(keyCode === UP_ARROW){
        player.move(0,-1);
    }
    
    if(keyCode === DOWN_ARROW){
        player.move(0,1);
    }
    
    if(keyCode === RIGHT_ARROW){
         player.move(1,0);
    }
    
    if(keyCode === LEFT_ARROW){
       player.move(-1,0);
    }
    if(keyCode === 68){
        player.aim(1,0);
    }
    
    if(keyCode === 65){
        player.aim(-1,0);
    }
    
    if(keyCode === 83){
        player.aim(0,1);
    }
    
    if(keyCode === 87){
        player.aim(0,-1);
    }
    if(keyCode == 13){
        enemies = [];
        bullets = [];
        bombs = [];
        blocks = [];
        score = 0;
        player = new Player();
        for(var i=0;i<10;i++){
            enemies[i] = new Enemy();
            enemies[i].spawn();
        }
        for(var i=0;i<20;i++){
            blocks[i] = new Block();
        }
        loop();
    }
    if(key === ' '){
        player.bomb();
    }
}
function Player(){
    this.i = 1;
    this.j = 1;
    this.x = 1;
    this.y = 0;
    this.health = 150;
    this.blocked = false;
    
    this.show = function(){
        fill(0,0,255);
        rect(this.i*w,this.j*w,w,w);
        stroke(255,0,0);
        strokeWeight(3);
        var x = this.i*w + w/2;
        var y = this.j*w + w/2;
        line(x,y,x+w*this.x,y+w*this.y);
    }
    
    this.move = function(i,j){
        for(var block of blocks){
            if(this.i+i == block.i && this.j+j == block.j)
                this.blocked = true;
            if(this.i+i < 0 || this.i+i >= rows || this.j+j < 0 || this.j+j >= rows)
                this.blocked = true; 
        }
        if(!this.blocked){
            this.i += i;
            this.j += j;
        }
        this.blocked = false;
    }
    
    this.aim = function(x,y){
        this.x = x;
        this.y = y;
        this.shoot();
    }
    this.shoot = function(){
        var x = this.i*w + w/2;
        var y = this.j*w + w/2;
        bullets[bullets.length] = new Bullet(x,y);
    }
    this.bomb = function(){
        var x = this.i*w + w/2;
        var y = this.j*w + w/2;
        bombs[bombs.length] = new Bomb(x,y);
    }
    this.attacked = function(damage){
        for(var enemy of enemies){
            if(this.i == enemy.i && this.j == enemy.j)
                this.health -= damage;
        }
    }
}
function Enemy(){
    this.i = 0;
    this.j = 0;
    this.count = 0;
    this.speed = 30;
    this.health = 100;
     
    this.spawn = function(){
        var spawned = false;
        var i = 0;
        var j = 0;
        var count = 0;
        while(!spawned){
            i = floor(random(0,rows));
            j = floor(random(0,rows));
            count = 0;
            for(var x = -1;x<2;x++){
                for(var y = -1;y<2;y++){
                    if(i != player.i+x || j != player.j+y)  
                        count++;
                } 
            }
            if(count === 9)
                spawned = true; 
        }
        this.i = i;
        this.j = j;
    }
    
    this.show = function(){
        fill(255,0,0,100);
        noStroke();
        rect(this.i*w,this.j*w,w,w);
    }
    this.move = function(){
        this.count++;
        if(this.count%this.speed === 0){
            var i = 0;
            var j = 0;
            i = ((player.i - this.i) > 0)?1:-1;
            j = ((player.j - this.j) > 0)?1:-1;
            this.i += i;
            this.j += j;
        }
    }
    this.attacked = function(damage){
        for(var bullet of bullets){
            if(bullet.x > this.i*w && bullet.x < this.i*w+w && bullet.y > this.j*w && bullet.y < this.j*w+w){
                this.health -= damage;
            }
        }
    }
}
function Block(){
    this.i = floor(random(2,rows));
    this.j = floor(random(2,rows));
    this.health = 100;
    this.col = 0;
    
    this.show = function(){
        stroke(0);
        strokeWeight(1);
        this.col = map(this.health,100,0,0,225);
        fill(this.col);
        rect(this.i*w,this.j*w,w,w);
    }
    
    this.hit = function(){
        for(var i = bullets.length-1;i>=0;i--){
            if(bullets[i].x > this.i*w && bullets[i].x < this.i*w+w && bullets[i].y > this.j*w && bullets[i].y < this.j*w+w){
                bullets.splice(i,1);
            }
        }
    }
    this.attacked = function(damage){
        if(abs(player.i-this.i) <= 1 && abs(player.j-this.j) <= 1)
            this.health -= damage;
    }
}
function Bullet(x,y){
    this.x = x;
    this.y = y;
    this.speed = 10;
    
    this.show = function(){
        fill(0);
        noStroke();
        ellipse(this.x,this.y,10);
    }
    
    this.move = function(x,y){
        this.x += this.speed*x;
        this.y += this.speed*y;
    }
}
function Bomb(x,y){
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.count = 0;
    this.range = 100;
    this.delay = 40;
    
    this.show = function(){
        fill(0,105,0);
        noStroke();
        ellipse(this.x,this.y,15);
    }
    
    this.move = function(x,y){
        this.x += this.speed*x;
        this.y += this.speed*y;
    }
    this.damage = function(enemies,damage){
        this.count++;
        if(this.count%this.delay == 0){
            for(var enemy of enemies){
                var d = dist(this.x,this.y,enemy.i*w,enemy.j*w);
                if(d<this.range){
                    enemy.health -= damage;
                }
            }
            fill(255,0,0);
            ellipse(this.x,this.y,this.range*2);
            bombs.splice(bombs.indexOf(this),1);
        }
    }
}