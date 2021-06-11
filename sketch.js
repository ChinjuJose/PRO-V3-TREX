var trex, trexRunning, trexCollided;
var ground, groundImage, invisibleGround;
var cloud, cloudImage, cloudsGroup;
var obstacle, ob1, ob2, ob3, ob4, ob5, ob6, obstaclesGroup;
var gameOver, restart, gameOverImage, restartImage;
var jumpSound, dieSound, scoreSound;
var sun, sunImage;
var bg;
var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  jumpSound = loadSound("jump.wav");
  dieSound = loadSound("collided.wav");
  groundImage = loadImage("ground.png");
  trexRunning = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  trexCollided = loadAnimation("trex_collided.png");
  cloudImage = loadImage("cloud.png");
  sunImage = loadImage("sun.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  bg = loadImage("backgroundImg.png");
  //scoreSound =  loadSound("checkpoint.mp3");
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  edges = createEdgeSprites();

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  sun = createSprite(width-50, 100, 10,10);
  sun.addImage(sunImage);
  sun.scale = 0.1

  trex = createSprite(50, height-120, 20, 70);
  trex.addAnimation("tr", trexRunning);
  trex.addAnimation("tc", trexCollided);
  trex.scale = 1;
 

  console.log(height);

  ground = createSprite(width/2, height, width, 2);
  ground.addImage("g", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(width/2, height-70, width, 20);
  invisibleGround.visible = false;

  trex.depth = invisibleGround.depth+5;

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale = 0.1;

  var randomNumber = Math.round(random(10, 60));
  console.log(randomNumber);

}

function draw() {

  background(bg);

  trex.collide(invisibleGround);
  trex.scale = 0.08;

  if (gameState == PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -2;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (touches.length>0 || keyDown("space") && trex.y > height-180) {
      trex.velocityY = -10;
      console.log(trex.y);
      jumpSound.play();
      touches = [];
    }
    trex.velocityY += 0.5;

    if (frameCount % 60 == 0) {
      spawnClouds();
    }
    if (frameCount % 150 == 0) {
      spawnObstacles();
    }

    score = score + Math.round(getFrameRate() / 60);

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }

  } else if (gameState == END) {

    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    trex.changeAnimation("tc",trexCollided);
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      restartGame();
    }
  }

  //trex.debug = true;
  trex.setCollider("circle",0,0,60); 

  text("Score: " + score, width-100, 50);
  drawSprites();
}

function spawnClouds() {

  cloud = createSprite(width, height-300, 40, 10);
  cloud.addImage(cloudImage);
  cloud.velocityX = -3;
  cloud.scale = 0.6;
  cloud.y = Math.round(random(10, 60));
  cloud.lifetime = 200;
  cloud.depth = trex.depth;
  trex.depth += 1;
  cloudsGroup.add(cloud);

}

function spawnObstacles() {

  var r = Math.round(random(1, 2));
  console.log(r);
  obstacle = createSprite(width, height-95, 40, 10);
  switch (r) {
    case 1:
      obstacle.addImage(ob1);
      obstacle.scale = 0.1;
      break;
    case 2:
      obstacle.addImage(ob2);
      obstacle.scale = 0.1;
      break;
  }
  obstacle.velocityX = -2;
  obstacle.scale = 0.5;
  obstacle.lifetime = -(width/obstacle.velocityX);
  obstaclesGroup.add(obstacle);
  
}

function restartGame(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  score = 0;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("tr",trexRunning);
}
