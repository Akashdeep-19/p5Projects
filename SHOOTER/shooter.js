var s;
function setup () {
    createCanvas(801,651);
    for(var i=0;i<k;i++){
        enemy[i] =new Enemy();
    }
  p=createP();
  s=  createP();
}
function draw () {
    background(255);
    line(0,0,0,height-1);
    line(0,0,width-1,0);
    line(0,height-1,width-1,height-1);
    line(width-1,0,width-1,height-1);
    p.html('REMAINING: '+enemy.length);
    s.html('BULLETS: '+bullets.length);
    user.show();
  // ammo.show();
    for(var i=0;i<enemy.length;i++){
    enemy[i].show();
    enemy[i].move();
    enemy[i].restrict();
     for(var j= 0;j<bullets.length;j++){ 
      if(enemy[i].hitt(bullets[j])){
               enemy[i].repel();
            }
     }  
    }
    for(var i= 0;i<bullets.length;i++){
    bullets[i].show();
    bullets[i].shoot();
       for(var j=0;j<enemy.length;j++){
            if(bullets[i].hit(enemy[j])){
               enemy[j].del = true;
            }
       }
    }
     if(keyIsDown(LEFT_ARROW)){
           user.pmove(-3,0);
          user.move(user.x-25,user.y);
        sx = -10;
         sy = 0;
            }
     if(keyIsDown(RIGHT_ARROW)){
         user.pmove(3,0);
          user.move(user.x+25,user.y);
         sx=10;
         sy = 0;
     }
       if(keyIsDown(UP_ARROW)){
         user.pmove(0,-3);
            user.move(user.x,user.y-25);
          sx = 0;
           sy = -10;
     }
       if(keyIsDown(DOWN_ARROW)){
         user.pmove(0,3);
          user.move(user.x,user.y+25);
          sx = 0;
           sy = 10;
       }
     for(var i=bullets.length-1;i>=0;i--){
         if(bullets[i].out()){
    bullets.splice(i,1);
    
         }
    }
    for(var i=enemy.length-1;i>=0;i--){
         if(enemy[i].del){
    enemy.splice(i,1);
    
         }
    }
    if(enemy.length===0){
        fill(0);
        textSize(40);
        text('YOU HAVE KILLED EVERYONE!',10,300)
    }
  
}

    
var user = new User();
var p;
var bullets =[];
var enemy = [];
var k =100;
var e = k-enemy.length;
var sx;
var sy;
function keyPressed (){
    if(key === ' '){
        var b = new Bullet();  
 bullets.push(b);
    }
    return false;
}

 
        

        

function User () {
    this.x=200;
    this.y=300;
    this.r=20;
    this.a=this.x-25;
    this.b=this.y;   
    this.show = function () {
        fill(0,0,255);
        ellipse(this.x,this.y,this.r*2,this.r*2);
        fill(0);
        line(this.x,this.y,this.a,this.b);
         
    }
    
    this.pmove=function(x,y){
        this.x =this.x +x;
        this.y= this.y +y;
    }
    
    this.move=function(x,y){
         this.a=this.x-25;
         this.b=this.y;
        this.a=x;
        this.b=y ;   
     }
}

function Bullet (){
    this.x=user.a;
    this.y=user.b;
    
    this.show = function(){
        fill(0);
        ellipse(this.x,this.y,5,5);
    }
    this.shoot=function(){
       this.x = this.x+sx;
        this.y= this.y+sy;;
    }
    this.out= function (){
        if(this.x>width || this.x<0 || this.y>height || this.y<0 ){
           return true;
        }
        else{
           return false; 
        }
    }
    
    this.hit= function(e){
        var d =dist(this.x,this.y,e.x,e.y);
        if(d<e.r){
            return true;
        }
       
        else{
            return false;
        }
    }
}


function Enemy (){
    this.x=random(0,width);
    this.y=random(0,height);
    this.r=15;
    this.del=false;
   
    this.show=function(){
        fill(0,255,0);
        ellipse(this.x,this.y,this.r*2,this.r*2);
         }
    this.move=function(){
        this.x=this.x+random(-4,4);
        this.y=this.y+random(-4,4);
    }
     this.restrict= function () {
        if(this.x>width || this.x<0 || this.y>height || this.y<0){
            this.x =random(0,width);
    this.y=random(0,height);
        }
    }
      this.hitt= function(e){
        var d =dist(this.x,this.y,e.x,e.y);
        if(d>this.r && d<this.r+15){
            return true;
        }
       
        else{
            return false;
        }
    }
      this.repel=function(){
        this.x=this.x+30;
        this.y=this.y+30;
    }
}
function Ammo(){
    this.pos=createVector(50,50);
    this.vel=createVector();
    mag.vel=0.1;
    this.target=createVector(user.x,user.y)
    this.show=function(){
        fill(230,0,0);
        ellipse(50,50,5,5);
    }
}















