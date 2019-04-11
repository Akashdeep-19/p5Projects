var speed = 18;
var steerSpeed = 3.1;
var bulletSpeed = 375;
var bulRange = 500;
var friction = 0.9;
var damage = 10;
var constDamage = 0.5;
var initialHealth = 100;
var size = 1200;
var totalPlayers = 100;
var maxFood = 100;
var maxAmmo = 50;
var player;
var blobs = [];
var bullets = [];
var foods = [];
var ammos = [];
var poisons = [];
var deltaTime = 0;
var timer = 0;

function setup(){
    createCanvas(1000,658);
    frameRate(80);
    var col = color(150,0,240);
    player = new Player(width/2,height/2,0,col);
    blobs.push(player);
    size = 4000;
    for(var i = 0;i<totalPlayers-1;i++){
        var data = {
            bulletPerception : random(300,400),
            dodgeAccuracy : random(1,1.1),
            healthWarn : random(5,30),
            ammoWarn : random(0,2),
            steerAccuracy : random(1,1.1),
            enemyPerception : random(300,600),
            shootAccuracy : random(1,1.1),
            shootDelay : random(0.2,0.5),
            aggresion : random(1),
            cooldown : random(5000,6000),
            stamina : random(1,1.1),
            gatherFood : random(1)
        }
        var col = color(random(255),random(255),random(255));
        blobs.push(new Player(random(-size,size),random(-size,size),i+1,col,data));
    }
    for(var i = 0;i<80;i++){
        var x = random(-size,size);
        var y = random(-size,size);
        foods.push(createVector(x,y));
    }
    for(var i = 0;i<30;i++){
        var x = random(-size,size);
        var y = random(-size,size);
        ammos.push(createVector(x,y));
    }
    for(var i = 0;i<100;i++){
        var x = random(-size,size);
        var y = random(-800,-600);
        poisons.push(createVector(x,y));
    }
}

function draw (){
    if(frameCount > 1)
        deltaTime = 1/frameRate();
    else
        deltaTime = 0;
    background(0);
    inputAxis();
    showMap();
    ui();
    translate(width/2-player.pos.x,height/2-player.pos.y);
    
    for(var i = foods.length-1;i>=0;i--){
        fill(0,200,0);
        rect(foods[i].x,foods[i].y,5,5);
        if(!contains(foods[i].x,foods[i].y))
            foods.splice(i,1);
    }
    for(var i = ammos.length-1;i>=0;i--){
        fill(0,0,200);
        rect(ammos[i].x,ammos[i].y,5,5);
        if(!contains(ammos[i].x,ammos[i].y))
            ammos.splice(i,1);
    }
    
    player.update();
    player.steer(inputX);
    player.move(inputY);
    player.gain();
    player.show();
    //player.respawn();
    for(var i = 1;i<blobs.length;i++){
        blobs[i].update();
        blobs[i].aiGame();
        blobs[i].gain();
        blobs[i].show();
        //blobs[i].respawn();
    }
    
    for(var i = this.bullets.length-1;i >= 0;i--){
        bullets[i].show();
        bullets[i].update();
        bullets[i].struck();
        bullets[i].restrict();
        if(bullets[i].hit)
            bullets.splice(i,1);
    }
    
    if(foods.length < maxFood){
        var x = random(-size,size);
        var y = random(-size,size);
        foods.push(createVector(x,y));
    }
    if(ammos.length < maxAmmo){
        var x = random(-size,size);
        var y = random(-size,size);
        ammos.push(createVector(x,y)); 
    }
    
    brMechanics();
}


function evaluate(){
    var scores = [];
    for(var i = 0;i<blobs.length;i++){
        scores.push({score : blobs[i].score,id : i});
    }
    scores.sort((a,b)=>b.score-a.score);
    for(var i = 0;i<blobs.length;i++){
        blobs[scores[i].id].rank = i+1;
    }
}

function contains (x,y){
    if(x < size && x > -size && y < size && y > -size)
        return true;
    else
        return false;
}

function brMechanics(){
    if((millis() - timer)/1000 > 5){
        size -= 60;
        maxFood -= 1;
        maxAmmo -= 0.5;
        timer = millis();
    }
    for(var i = blobs.length-1;i >= 0;i--){
        if(!contains(blobs[i].pos.x,blobs[i].pos.y))
            blobs[i].damage = 5;   
        else
            blobs[i].damage = constDamage; 
        if(player.health < 0)noLoop();
        if(blobs[i].health < 0){
            blobs.splice(i,1);
        }
    }
    stroke(255);
    noFill();
    rectMode(CENTER);
    rect(0,0,2*size,2*size);
}

function showMap(){
    noStroke();
    fill(250,50);
    rectMode(CORNER);
    rect(width-200,20,180,180);
    
    var x = map(player.pos.x,-size,size,width-200,width-20);
    var y = map(player.pos.y,-size,size,20,200);
    noStroke();
    fill(150,0,200,150);
    ellipse(x,y,5,5);
    
    for(var i = 0;i<blobs.length;i++){
        if(player == blobs[i])continue;
        if(blobs[i].rank < player.rank){
            var x = map(blobs[i].pos.x,-size,size,width-200,width-20);
            var y = map(blobs[i].pos.y,-size,size,20,200);
            noStroke();
            fill(250,100,100,70);
            ellipse(x,y,3,3);
        }
    }
}

function ui(){
    fill(255);
    textAlign(CENTER,CENTER);
    textSize(30);
    text(blobs.length,width-350,50);
    
    fill(255,0,0);
    textAlign(CENTER,CENTER);
    textSize(30);
    text(player.kills,width-250,50);
    
    if(blobs.length == 1){
        fill(255,255,0);
        textAlign(CENTER,CENTER);
        textSize(50);
        text("WINNER WINNER CHICKEN DINNER!",width/2,height/3);
        size = -1000;
    }
}

//setInterval(evaluate,500);

function Player (x,y,i,col,data){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();
    this.rot = createVector(1,0);
    this.r = 25;
    this.health = initialHealth;
    this.col = col;
    this.ammo = 5;
    this.score = i;
    this.kills = 0;
    this.rank = 0;
    this.damage = constDamage;
    this.timer = 0;
    this.waitTimer = 0;
    this.scoreTimer = 0;
    this.closestEnemy = null;
    this.shudDodge = false;
    this.closestBul = null;
    this.state = 'gather';
    if(data)
        this.data = data;
    else
        this.data = null;
    
    this.update = function(){
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
        this.vel.mult(friction);
        
        this.health -= this.damage*deltaTime;
        if(millis()-this.scoreTimer > 100){
            this.score++;
            this.scoreTimer = millis();
        }
    }
    
    this.show = function(){
        push();
        translate(this.pos.x,this.pos.y);
        rotate(this.rot.heading());
        strokeWeight(3);
        stroke(255);
        line(0,0,this.r+10,0);
        var hFade = map(this.health,0,100,10,255);
        var col = color(this.col._getRed(),this.col._getGreen(),this.col._getBlue());
        fill(col);
        stroke(255,hFade);
        ellipse(0,0,this.r*2);
        fill(255);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(20);
        text(this.kills,0,0);
        pop();
    }
    
    this.addForce = function(force){
        this.acc.add(force);
    }
    
    this.gain = function(){
        for(food of foods){
            var d = p5.Vector.dist(food,this.pos);
            if(d < this.r){
                foods.splice(foods.indexOf(food),1);
                this.health += 5;
            }
        }
        for(ammo of ammos){
            var d = p5.Vector.dist(ammo,this.pos);
            if(d < this.r){
                ammos.splice(ammos.indexOf(ammo),1);
                this.ammo += 5;
            }
        }
    }
    
    this.steer = function(x){
        this.rot.rotate(steerSpeed*x*deltaTime);
    }
    
    this.move = function(y){
        var force = this.rot.copy();
        force.mult(-speed*y*deltaTime);
        this.addForce(force);
    }
    
    this.shoot = function(space){
        if(this.ammo > 0){
            bullets.push(new Bullet(this.pos.x,this.pos.y,this.col,this));
            this.ammo--;
        }
    }
    
    this.aiSteer = function(angle){
        var dif = angle - this.rot.heading();
        var x = 0;
        if((dif > 0 && dif < PI) || dif < -PI)
            x = 1; 
        if((dif < 0 && dif > -PI) || dif > PI)
            x = -1; 
        this.steer(x);
    }
    
    this.checkBullets = function(){
        var minD = Infinity;
        var closest = null;
        for(bullet of bullets){
            if(bullet.parent == this)continue;
            var d = p5.Vector.dist(bullet.pos,this.pos);
            if(d<minD && d < this.data.bulletPerception){
                minD = d;
                closest = bullet;
            }
        }
        if(closest){
            var dir = p5.Vector.sub(this.pos,closest.pos);
            var theta = closest.vel.angleBetween(dir);
            if(minD*theta < this.r){
                this.shudDodge = true;
                this.closestBul = closest;
            }
            else{
                this.shudDodge = false;
                this.closestBul = null;
            }
        }else{
            this.shudDodge = false;
            this.closestBul = null;    
        }
    }
    
    this.dodge = function(dir){
        var angle1 = dir.heading() + PI/2;
        var angle2 = dir.heading() - PI/2;
        var dif1 = abs(this.rot.heading() - angle1);
        if(dif1 > PI)dif1 = 2*PI - dif1;
        var dif2 = abs(this.rot.heading() - angle2);
        if(dif2 > PI)dif2 = 2*PI - dif2;
        if(dif1 < dif2){
            this.aiSteer(angle1);
            if(random()<this.data.dodgeAccuracy)
                this.move(-1);
        }
        else{
            this.aiSteer(angle2);
            if(random()<this.data.dodgeAccuracy)
                this.move(1);
        }
    }
    
    this.eat = function(gains){
        var minD = Infinity;
        var closest = null;
        for(gain of gains){
            if(gain instanceof p5.Vector){
                var d = p5.Vector.dist(gain,this.pos);
                if(d<minD){
                    minD = d;
                    closest = gain;
                }
            }
            else{
                if(gain == this)continue;
                var d = p5.Vector.dist(gain.pos,this.pos);
                if(d<minD && this.rank >= gain.rank){
                    minD = d;
                    closest = gain.pos; 
                }
            }
        }
        if(closest){
            var dir = p5.Vector.sub(closest,this.pos);
            var angle = dir.heading();
            if(random()>this.data.steerAccuracy)
                angle += random()<0.5?-PI/3:PI/3;
            this.aiSteer(angle);
            this.move(-1);
        }
    }
    
    this.checkEnemies = function(){
        var minD = Infinity;
        var closest = null;
        for(blob of blobs){
            if(blob == this)continue;
            var d = p5.Vector.dist(blob.pos,this.pos);
            if(d<minD && d < this.data.enemyPerception){
                minD = d;
                closest = blob;
            }
        }
        this.closestEnemy = closest;
    }
    
    this.aiShoot = function(){
        var dir = p5.Vector.sub(this.closestEnemy.pos,this.pos);
        var angle = dir.heading();
        if(random()>this.data.shootAccuracy)
            angle += random()<0.5?-PI/2:PI/2;
        this.aiSteer(angle);
        if(millis() - this.timer > this.data.shootDelay*1000){
            this.shoot();
            this.timer = millis();
        }    
    }
    
    this.aiGame = function(){
        this.checkEnemies();
        this.checkBullets();
        if(this.shudDodge){
            this.dodge(this.closestBul.vel);
        }
        else if(this.health < this.data.healthWarn){
            if(this.closestEnemy && this.health-this.closestEnemy.health > 0 && this.ammo>this.data.ammoWarn){
                this.aiShoot();
            }else{
                this.eat(foods);
            }
        }
        else if(this.ammo <= this.data.ammoWarn){
            this.eat(ammos);
        }
        else if(this.closestEnemy){
            this.aiShoot();
        }
        else if(this.health >= this.data.healthWarn){
            if(millis() - this.waitTimer > this.data.cooldown){
                if(random()<this.data.aggresion)
                    this.state = 'chase';
                else
                    this.state = 'gather';
                if(random()>this.data.stamina)
                    this.state = 'wait';
                this.waitTimer = millis();
            }
            if(this.state == 'gather'){
                if(random() < this.data.gatherFood){
                    this.eat(foods);
                }
                else{
                    this.eat(ammos);
                }
            }
            if(this.state == 'chase'){
                this.eat(blobs);
            }
            if(this.state == 'wait'){
                this.move(0);
            }
        }
    }
    
    this.respawn = function(){
        if(this.health < 0){
            if(this == player){
                push();
                rectMode(CENTER);
                noStroke();
                fill(255,0,0);
                rect(this.pos.x,this.pos.y,width,height);
                pop();
            }
            this.pos.set(random(-size,size),random(-600,-800));
            this.vel.set(0,0);
            this.acc.set(0,0);
            this.score = 0;
            this.kills = 0;
            this.ammo = 5;
            this.health = initialHealth;
        }
    }
}

function Bullet(x,y,col,parent){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.hit = false;
    this.parent = parent;
    this.vel = parent.rot.copy();
    this.startTime = millis();
    
    this.show = function(){
        noStroke();
        fill(255);
        ellipse(this.pos.x,this.pos.y,5,5);
    }    
        
    this.update = function(){
        this.vel.setMag(bulletSpeed*deltaTime);
        this.pos.add(this.vel);
    }
    
    this.struck = function(){
        for(blob of blobs){
            if(blob == this.parent)continue;
            var d = p5.Vector.dist(blob.pos,this.pos);
            if(d < blob.r){
                this.hit = true;
                blob.health -= damage;
                if(blob.health < 0)
                    this.parent.kills++;
            }
        }
    }
    
    this.restrict = function(){
        if(millis() - this.startTime > 1000*bulRange/(bulletSpeed)){
            this.hit = true;
        }
    }
}