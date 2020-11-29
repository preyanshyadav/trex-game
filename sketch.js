//TREX GAme by Preyansh using JS



//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trexDead, trexRun;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var gameOver, gmImage;
var restartIcon, restartImage;
var jumpSound, checkpointSound, dieSound;
var cactus, cactusGroup;
var cactusImg1, cactusImg2, cactusImg3, cactusImg4, cactusImg5, cactusImg6;

//Create Media library and load to use it during the course of the software
//executed only once at the start of the program
function preload() {
  trexRun = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexDead = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  cactusImg1 = loadImage("obstacle1.png");
  cactusImg2 = loadImage("obstacle2.png");
  cactusImg3 = loadImage("obstacle3.png");
  cactusImg4 = loadImage("obstacle4.png");
  cactusImg5 = loadImage("obstacle5.png");
  cactusImg6 = loadImage("obstacle6.png");

  gmImage = loadImage("gameOver.png");

  restartImage = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
}

//define the intial environment of the software(before it is used)
//by defining the declared variables with default values
//executed only once at the start of the program
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //create trex sprite
  trex = createSprite(50, height - 20, 20, 50);
  trex.addAnimation("trexRun", trexRun);
  trex.addAnimation("trexDead", trexDead);
  trex.scale = 0.6;
  trex.debug = false;
  trex.setCollider("rectangle", 0, 0, 50, 80);

  //create a ground sprite
  ground = createSprite(width / 2, height - 20, width, 20);
  ground.addAnimation("groundImage", groundImage);
  invisibleGround = createSprite(width / 2, height - 15, width, 5);
  invisibleGround.visible = false;

  //create groups
  cloudsGroup = createGroup();
  cactusGroup = createGroup();

  //creating score
  score = 0;
  highScore = 0;
  displayHS = false;

  //creating game objects
  gameOver = createSprite(width / 2, height / 2, 30, 30);
  gameOver.addAnimation("gmImage", gmImage);
  gameOver.scale = 0.8;

  restartIcon = createSprite(width / 2, height - 86, 30, 30);
  restartIcon.addAnimation("restartImage", restartImage);
  restartIcon.scale = 0.6;
  //game states
  PLAY = 1;
  END = 0;
  gameState = PLAY;
  textSize(18);
  fill(258);

}

//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw.
//All commands to be executed and checked continously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {
  //set background to white
  background(0);


  if (gameState == PLAY) {

    gameOver.visible = false;
    restartIcon.visible = false;

    //score calculation
    score = score + Math.round(World.frameRate / 60);


    //sound for score checkpoint
    if (score % 100 === 0) {
      checkpointSound.play();
    }

    //condition for displaying high score
    if (displayHS === true) {
      text("High Score:" + highScore, width - 145, 54);
    }

    //ground behaviour
    ground.velocityX = -(2 + score / 300);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //trex behaviour
    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= height - 50) {
      trex.velocityY = -15;
      jumpSound.play();
    }


    //add gravity
    trex.velocityY = trex.velocityY + 0.8;

    //function call to create clouds
    spawnClouds();
    //function to call to create cactus
    spawnCactus();

    if (trex.isTouching(cactusGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState == END) {

    if (score > highScore) {
      highScore = score;
    }
    text("High Score:" + highScore, width - 145, 54); //concatenation

    gameOver.visible = true;
    restartIcon.visible = true;

    ground.velocityX = 0;

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);

    cactusGroup.setVelocityXEach(0);
    cactusGroup.setLifetimeEach(-1);

    trex.velocityY = 0;
    trex.changeAnimation("trexDead", trexDead);

    if (mousePressedOver(restartIcon)) {
      gameState = PLAY;

      cactusGroup.destroyEach();
      cloudsGroup.destroyEach();

      trex.changeAnimation("trexRun", trexRun);

      score = 0;
      displayHS = true;
    }

  }

  //stop trex from falling down
  trex.collide(invisibleGround);

  //display score
  text(score, width - 60, 33);

  drawSprites();
}
//function definition to create clouds
function spawnClouds() {
  if (World.frameCount % 60 == 0) {
    cloud = createSprite(width + 5, 100, 30, 40);
    cloud.velocityX = -3;
    cloud.addAnimation("cloudImage", cloudImage);
    cloud.scale = 0.7;
    cloud.y = random(height / 2 - 50, height / 2 + 50);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = (-1) * (width / cloud.velocityX);
    cloudsGroup.add(cloud);

  }
}

//function defination to create cactus
function spawnCactus() {

  if (World.frameCount % 120 == 0) {
    cactus = createSprite(width + 5, height - 40, 30, 40);
    cactus.velocityX = -(2 + score / 300);
    var caseNumber = Math.round(random(1, 6));
    console.log(caseNumber);
    switch (caseNumber) {
      case 1:
        cactus.addImage("cactusImg1", cactusImg1);
        cactus.scale = 0.85;
        break;
      case 2:
        cactus.addImage("cactusImg2", cactusImg2);
        cactus.scale = 0.85;
        break;
      case 3:
        cactus.addImage("cactusImg3", cactusImg3);
        cactus.scale = 0.72;
        break;
      case 4:
        cactus.addImage("cactusImg4", cactusImg4);
        cactus.scale = 0.65;
        break;
      case 5:
        cactus.addImage("cactusImg5", cactusImg5);
        cactus.scale = 0.50;
        break;
      case 6:
        cactus.addImage("cactusImg6", cactusImg6);
        cactus.scale = 0.58;
        break;
      default:
        cactus.addImage("cactusImg4", cactusImg4);
        cactus.scale = 0.65;
        break;
    }
    //cactus.setAnimation("obstacle"+imgnumber);//concatenation


    cactus.lifetime = (-1) * (width / cactus.velocityX);
    cactusGroup.add(cactus);
  }
}