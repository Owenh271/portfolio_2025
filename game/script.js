var car,carImg
var background,backgroundImg


function preload(){
    carImg = loadImage("car.png");
    backgroundImg = loadImage("background.png");
}

function setup(){
    createCanvas(windowWidth,windowHeight);
    background = createSprite(500,500,50,50);
    background.addImage("background",backgroundImg);
} 

function draw(){
    
    drawSprites();
}

