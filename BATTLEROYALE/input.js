var inputX = 0;
var inputY = 0;
var space;
var paused = false;
var deltaTime = 0;

function time (){
    if(frameCount > 1)
        deltaTime = 1/frameRate();
    else
        deltaTime = 0;
}

function inputAxis(){
    time();
    if(keyIsDown(LEFT_ARROW)){
        if(inputX > -1)
            inputX -= 2*deltaTime;
        else
            inputX = -1;
    }
    if(keyIsDown(RIGHT_ARROW)){
        if(inputX < 1)
            inputX += 2*deltaTime;
        else
            inputX = 1;
    }
    if(keyIsDown(UP_ARROW)){
        if(inputY > -1)
            inputY -= 2*deltaTime;
        else
            inputY = -1;
    }
    if(keyIsDown(DOWN_ARROW)){
        if(inputY < 1)
            inputY += 2*deltaTime;
        else
            inputY = 1;
    }
    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW))
        inputX = 0;
    if(!keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW))
        inputY = 0;
    
    if(paused){ 
        fill(255);
        textAlign(CENTER,CENTER);
        textSize(30);
        text("PAUSED\n",width/2,height/3);     
    }
}

function keyPressed (){
    if(key === ' '){
        player.shoot();
    }
    
    if(keyCode == 27){
        if(!paused){
            noLoop();
            paused = true;
        }
        else{
            loop();
            paused = false;
        }
    }

    return false;
}
