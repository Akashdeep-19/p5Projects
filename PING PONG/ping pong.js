function setup(){
    createCanvas(800,570);
    for(var i=0;i<1;i++){
    ball[i] = new Ball();
    }
    pone = new POne();
    ptwo = new PTwo();
    rdscre = createP();
    blscre = createP();
    
}

function draw(){
    background(41);
    r = rdscre.html('RED: '+ ocount);
    b = blscre.html('BLUE: '+ tcount);
    for(var i=ball.length-1;i>=0;i--){
       ball[i].show();
       ball[i].move();
       ball[i].restrict();
       if(ball[i].x > width){
        ball.splice(i,1);
        ball.push(new Ball());   
    } 
       if(ball[i].x < 0){
        ball.splice(i,1);
        ball.push(new Ball());   
    }    
    }
    pone.show();
    ptwo.show();
   
    if(keyIsDown(UP_ARROW)){
        ptwo.move(-3);  
    }
    if(keyIsDown(DOWN_ARROW)){
        ptwo.move(3);   
    }
    if(keyIsDown(83)){
        pone.move(3);   
    }
    if(keyIsDown(87)){
        pone.move(-3);   
    }
    
    if(tcount === 11){
        textSize(40);
        fill(0,160,255);
        text('BLUE WINS!!',300,300);
        noLoop();
    }
    if(ocount === 11){
        textSize(40);
        fill(255,160,0);
        text('RED WINS!!',300,300);
        noLoop();
    }
}

var ball = [];
var bxspd = 2;
var byspd = 3;
var pone;
var ptwo;
var ocount = 0;
var tcount = 0;
var rdscre;
var blscre;
var r;
var b;

function Ball(){
    this.x = width/2;
    this.y = height/2;
    
    this.show = function(){
        fill(255,127,80);
        ellipse(this.x,this.y,30,30);
    }
    
    this.move = function(){
        this.x += bxspd;
        this.y += byspd;
    }
    
    this.restrict = function(){
        if(this.y > height){
            byspd = (-1)*byspd;
        }
        if(this.y < 0){
            byspd = (-1)*byspd;
        }
        if(this.x < pone.x+28 && this.y > pone.y && this.y < pone.y+150){
            bxspd = (-1.05)*bxspd;
        }
        if(this.x > ptwo.x-15 && this.y > ptwo.y && this.y < ptwo.y+150){
            bxspd = (-1.05)*bxspd;
        }
        if(this.x > width){
            ocount++;   
        }
        if(this.x < 0){
            tcount++;   
        }
        
    }
}

function POne(){
    this.x = 1;
    this.y = height/4;
    
    this.show = function(){
        fill(255,0,0);
        rect(this.x,this.y,10,150);
        this.y = constrain(this.y,0,height-150);
    }
    
    this.move = function(ys){
        this.y += ys;
    }
}

function PTwo(){
    this.x = width - 11;
    this.y = height/4;
    
    this.show = function(){
        fill(0,0,255);
        rect(this.x,this.y,10,150);
        this.y = constrain(this.y,0,height-150);
    }
    
    this.move = function(ys){
        this.y += ys;
    }
}




