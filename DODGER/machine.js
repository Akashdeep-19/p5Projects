function Player(){
   this.show = function(){
        this.y = constrain(this.y,415,525);
        fill(200,35,150);
        rect(this.x,this.y,10,55)
    }
   
//   this.calcFitness = function(){
//       var d = 
//   }
    
    this.run = function(obstcle){
        var d = this.x - obstcle.x;
        if(d < -20){
            return true;
        }
        else{
            return false;
        }
    }
    
    this.jump = function(){
        this.y+= -yspd;
        if(this.y == 525){
         yspd = 20;
    }
        else if(this.y<423){
        yspd = -3;
    }
    } 
}