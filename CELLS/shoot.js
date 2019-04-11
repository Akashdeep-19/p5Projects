function setup () {
    createCanvas(600,600);
     for(var i =0;i<50;i++) {
player[i]= new Player();    
}
}
var player = [];
function draw () {
    background(255);
    for(var i =0;i<player.length;i++) {
   player[i].show();
   player[i].move(); 
   player[i].restrict();  
   for(var j =0;j<player.length;j++) {
      if(i!==j && player[i].collision(player[j])) {
          player[i].repel();
          player[j].repell();      
      }
        if(i!==i && player[i].collision(player[i])) {
            player[i].repel();
          player[i].repell(); 
       }
         if(j!==j && player[j].collision(player[j])) {
            player[j].repel();
          player[j].repell(); 
       }
   }       
}
}
function Player() {
    this.x =random(200,300);
    this.y=random(200,300);
    this.r=10;
    this.show= function () {
        fill(255,0,0);
        ellipse(this.x,this.y,this.r*2,this.r*2);
    }
    this.move= function() {
        this.x=this.x +random(-1,1);
        this.y=this.y +random(-1,1);
    }
    this.collision =function(other) {
      var d =dist(this.x,this.y,other.x,other.y);
        if(d<this.r*2+10){
            return true
        }
        else {
            return false
        }
    }
    this.restrict= function () {
        if(this.x>600 || this.x<0 || this.y>600 || this.y<0){
            this.x =random(300,600);
    this.y=random(300,600);
        }
    }
    this.repel = function (){
        this.x=this.x +10;
        this.y=this.y+10;
    }
     this.repell = function (){
        this.x=this.x -10;
        this.y=this.y-10;
    }
    }
