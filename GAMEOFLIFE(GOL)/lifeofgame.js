var grid;
var w = 15;
var rows = 600/w;
var cols = 600/w;

function make2DArray(rows,cols){
    var arr = new Array(rows);
    for(var i=0;i<arr.length;i++){
        arr[i] = new Array(cols);    
    }
    return arr;
}

function setup(){
    createCanvas(600,600);
    grid = make2DArray(rows,cols);
    for(var j=0;j<rows;j++){
        for(var i=0;i<rows;i++){
            grid[i][j] = new Cell(i,j);   
        }  
    }
    grid[10][10].alive = true;
    grid[11][10].alive = true;
    grid[11][11].alive = true;
    grid[30][30].alive = true;
    grid[30][31].alive = true;
    grid[31][30].alive = true;
}

function draw(){
    background(0);
    
//    grid[10][10].alive = true;
//    grid[11][10].alive = true;
//    grid[11][11].alive = true;
    //grid[13][13].alive = true;
    for(var j=0;j<rows;j++){
        for(var i=0;i<rows;i++){
            grid[i][j].show();
            grid[i][j].checkNieghbors();
            grid[i][j].life();
        }  
    }
}

function mousePressed(){
    for(var j=0;j<rows;j++){
        for(var i=0;i<rows;i++){
            if(grid[i][j].contains(mouseX,mouseY)){
                if(grid[i][j].alive){
                    grid[i][j].alive = false;
                } else{
                    grid[i][j].alive = true;
                }
            }   
        }  
    }  
}

function Cell(i,j){
    this.i = i;
    this.j = j;
    this.alive = false;
    this.population = -1;
    this.show = function(){
        var x = this.i*w;
        var y = this.j*w;
        if(this.alive){
            fill(200);
        }else{
            fill(51);
        }
        rect(x,y,w,w);
    }
    
    this.checkNieghbors = function(){
        var total = 0;
        for(var x = -1;x<=1;++x){
            for(var y = -1;y<=1;++y){
            var i = this.i+x;
            if(i<0 || i>=rows)continue;
            var j = this.j+y;
            if(j<0 || j>=rows)continue;
            if(grid[this.i][this.j].alive){
                this.population = -1;
            }else{
                this.population = 0;
            }
            if(grid[i][j].alive){
                total++;
            }
        }    
    }
        this.population += total;
}
    
    this.contains = function(x,y){
        return(x>this.i*w && x<this.i*w+w && y>this.j*w && y<this.j*w+w)
    }
    
    this.life = function(){
        if(this.population == 3){
            this.alive = true;
        }
        if(this.population>3){
            this.alive = false;
        }
        if(this.population<2){
            this.alive = false;
        }
    }
}