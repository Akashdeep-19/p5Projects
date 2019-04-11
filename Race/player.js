function Player(x,y,color,l,b){
    this.pos = createVector(x,y);
    this.rot = createVector(0,1);
    this.vel = createVector();
    this.acc = createVector(0,gravity);
    this.l = l;
    this.b = b;
    this.color = color;
    this.brakes = false;
    this.lap = 0;
    this.lapCounted = false;
    
    this.update = function(){
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.limit(limit);
        this.acc.mult(0);
        this.vel.mult(0.996);
    }
    
    this.addForce = function(force){
        var pos = this.rot.copy();
        pos.mult(force);
        this.acc = pos.copy();
    }
    this.steer = function(torque){
        this.rot.rotate(torque);
        if(!this.brakes)
            this.vel.rotate(torque);
    }
    this.brake = function(force){
        this.vel.mult(force);
        this.brakes = true;
    }
    
    this.show = function(){
        push();
        rectMode(CENTER);
        stroke(255);
        strokeWeight(1);
        fill(this.color);
        translate(this.pos.x,this.pos.y);
        rotate(this.rot.heading());
        rect(this.l/2-this.b/2,0,this.b,this.b);
        fill(220,150);
        rect(0,0,this.l,this.b);
        pop();
    }
    this.restrict = function(){
        var dx = abs(cos(this.rot.heading())*this.l/2) + abs(sin(this.rot.heading())*this.b/2);
        var dy = abs(cos(this.rot.heading())*this.b/2) + abs(sin(this.rot.heading())*this.l/2);
        if(height-this.pos.y < dy || this.pos.y-0 < dy){
            if(height-this.pos.y < dy)
                this.pos.y = height - dy;
            else if(this.pos.y-0 < dy)
                this.pos.y = dy;
            this.vel.y *= -1;
        }
        if(width-this.pos.x < dx || this.pos.x-0 < dx){
            if(width-this.pos.x < dx)
                this.pos.x = width - dx;
            else if(this.pos.x-0 < dx)
                this.pos.x = dx;
            this.vel.x *= -1;
        }
    }
    this.hit = function(x,y,other){
        var dy = abs(sin(this.rot.heading())*(x-this.pos.x)-cos(this.rot.heading())*(y-this.pos.y));
        var dx = abs(cos(this.rot.heading())*(x-this.pos.x)+sin(this.rot.heading())*(y-this.pos.y));
        if(dy <= this.b/2+other.r && dx <= this.l/2+other.r){
            other.vel = this.vel.copy();
            this.vel.mult(-0.7);
        }
    }
    this.hitP = function(other){
        var px = abs(cos(this.rot.heading())*this.l/2) + abs(sin(this.rot.heading())*this.b/2);
        var py = abs(cos(this.rot.heading())*this.b/2) + abs(sin(this.rot.heading())*this.l/2);
        var ox=abs(cos(other.rot.heading())*other.l/2)+abs(sin(other.rot.heading())*other.b/2);
        var oy=abs(cos(other.rot.heading())*other.b/2)+abs(sin(other.rot.heading())*other.l/2);
        if(abs(other.pos.y-this.pos.y) < py+oy && abs(other.pos.x-this.pos.x) < px+ox){
            var v = this.vel.copy();
            this.vel = other.vel.copy();
            other.vel = v.copy();
        }
    }
    
}