function preload() {
  monkey_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");

  monkey_collided = loadAnimation("Monkey_09.png")

  bananaImg = loadImage("banana.png");
  stoneImg = loadImage("stone.png");
  jungleBack = loadImage("jungle.jpg");

  resetImg = loadImage("reset.png");
  gameOverI = loadImage("gameOver.png");
}

function setup() {
  createCanvas(500, 300);

  PLAY = 1;
  END = 0;
  gameState = PLAY;

  score = 0;

  back = createSprite(0, 80);
  back.addImage(jungleBack);
  back.x = back.width / 2;
  console.log(back.width)

  monkey = createSprite(60, 250);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkey_collided);
  monkey.scale = 0.06;
  monkey.debug = true;
  monkey.setCollider("rectangle", 0, -10, 150, 300);

  inviGround = createSprite(250, 255, 500, 15);
  inviGround.visible = false;

  foodGroup = createGroup();
  obstacleGroup = createGroup();

  reset = createSprite(250, 230);
  reset.addImage(resetImg);
  gameOver = createSprite(250, 150);
  gameOver.addImage(gameOverI);
}

function draw() {
  drawSprites();
  
  textSize(18);
  fill("yellow");
  text("score = " + score,400,25);

  if (gameState === PLAY) {
    reset.visible = false;
    gameOver.visible = false;

    back.velocityX = -4;
    if (back.x < 0) {
      back.x = back.width / 2;
    }
    spawnObstacle();
    spawnBanana();


    if (keyDown("space") && monkey.y > 180) {
      monkey.velocityY = -12
    }
    monkey.velocityY = monkey.velocityY + 0.6

    for (var i = 0; i < foodGroup.length; i++) {
      if (foodGroup.isTouching(monkey)) {
        foodGroup.get(i).destroy();
        score = score + 2
      }
    }
    if (obstacleGroup.isTouching(monkey)) {

      if (sizedecreased === false) {
        monkey.scale = monkey.scale - 0.01;
        console.log(monkey.scale)
        sizedecreased = true;
        if(monkey.scale <= 0.06) {
            gameState = END
        }
      }
    }
    if (obstacleGroup.isTouching(monkey) == false) {
      sizedecreased = false;
    }
    if (score % 4 === 0 && score > 0) {
      if (sizeincreased === false) {
        monkey.scale = monkey.scale + 0.02 ;
        sizeincreased = true;
      }
    } else {
      sizeincreased = false;
    }
    
  }
  if (gameState === END) {
    reset.visible = true;
    gameOver.visible = true;

    monkey.velocityY = 0;

    back.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);

    obstacleGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    monkey.changeAnimation("collided");
  }

  if (mousePressedOver(reset)) {
    gameState = PLAY;
    monkey.changeAnimation("running");
    restart();
  }

  monkey.collide(inviGround);
  
}  


function restart() {
  foodGroup.destroyEach();
  obstacleGroup.destroyEach();
}

function spawnObstacle() {
  if (World.frameCount % 120 === 0) {
    stone = createSprite(505, 260);
    stone.addImage(stoneImg);
    stone.scale = 0.1;
    stone.velocityX = -4;
    stone.lifetime = 180;
    obstacleGroup.add(stone);
  }
}

function spawnBanana() {
  if (World.frameCount % 80 === 0) {
    banana = createSprite(505, 276);
    banana.y = Math.round(random(130, 200));
    banana.addImage(bananaImg);
    banana.scale = 0.038;
    banana.velocityX = -4;
    banana.lifetime = 180;
    foodGroup.add(banana);
  }
}