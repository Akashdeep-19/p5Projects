var buildings = [];
var heights = [];
var w = 2;

function setup(){
    createCanvas(800,600);
    for(var i =0;i<width/w;i++){
        buildings[i] = new Building(i*w,random(height));
        heights[i] = buildings[i].y;
    }
}

function draw(){
    background(200);
    for(var i =0;i<buildings.length;i++){
        buildings[i].show();
    }
}

function mousePressed(){
    for(var i =0;i<buildings.length;i++){
        buildings[i].sort();
    }   
}

function sorter(arr){
    var newArr = [];
    for(var i = 0;i<arr.length;i++){
        var count = 0;
        for(var j=0;j<arr.length;j++){
            if(arr[i]>arr[j] && i!=j){
                count++;
            }
        }
        newArr[count] = arr[i];
        if(newArr[i] === undefined){
            newArr[i] = newArr[i-1];
        }
    }     
    return newArr;
}

function Building(x,y){
    this.x = x;
    this.y = y;
    
    this.show = function(){
        var h = height - this.y;
        fill(51);
        rect(this.x,this.y,w,h);
    }
    
    this.sort = function(){
        var sorted = sorter(heights);
        var bl = buildings.length;
        for(var i=0;i<bl;i++){
            buildings[i].y = sorted[bl-i-1];   
        }
    }
}