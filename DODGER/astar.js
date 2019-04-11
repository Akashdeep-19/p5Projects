function setup(){
  createCanvas(800,600);
for(var i=0;i<1;i++){
  player[i] = new Player();
}
  for(var i=0;i<100;i++){
    var r = random(80);
    var rx = random(35,58);
    obstacle[i] = new Obstacle(spacing*i+ r,rx);
  } 
    p = createP();
}
function draw(){
    background(51);
    fill(255);
    line(0,580,800,580);
   
    scre = p.html('REMAINING BLOCKS: '+obstacle.length);
    for(var j=0;j<player.length;j++){
       player[j].show();
   }
    for(var i=0;i<obstacle.length;i++){
    obstacle[i].show();
    obstacle[i].move();    
    for(var j=0;j<player.length;j++){
       if (player[j].run(obstacle[i])){
         player[j].jump();
       }
      if (obstacle[i].hits(player[j])){
           noLoop();
      } 
    }
    }
     for(var i=0;i<obstacle.length;i++){
    if(obstacle[i].x<-20){
        obstacle.splice(i,1);
     }
    }    
   
   if(obstacle.length === 0){
       fill(170,205,210);
       textSize(48);
    text('YOU JUST BEAT THE GAME!!!',100,300)
   }
    
}

var obstacle = [];
var player = [];
var yspd = 0;
var ospd = 3.5;
var spacing = 420;
 var scre;
var p;
   
function Obstacle(p,r){
    this.x = 500 +p;
    this.xx = 200 + p;
    this.y = 530;
    this.r = r;
    
    this.show = function(){
        fill(0);
        rect(this.x,this.y,this.r,50);
        stroke(255);
        fill(51); 
        rect(this.xx,575,5,6); 
    }
    this.move = function(){
        this.x += -ospd;
         this.xx += -ospd;
        ospd += 0.00003;
        spacing += 1
         }
    this.hits = function(plyr){
    if(plyr.x>this.x && plyr.x<this.x+this.r && plyr.y>480){
       return true;
    }
        else{
            return false;
        }
    } 
}


 