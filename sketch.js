let assets = {
  "player" : undefined,
  "girl_hub_idle" : undefined,
  "hub" : undefined
};
const GAME_STATES = {
  MAIN_MENU : 0,
  HAPPY_BIRTHDAY : 1,
  GAME_HUB : 2,
  GAME_TAVERN : 3
}

let player;
let bg;
let state;
let entities = [];

function preload() {
  assets["player"] = loadImage("assets/player.png");
  assets["girl_hub_idle"] = loadImage("assets/girl_hub_idle.png");
  assets["hub"] = loadImage("assets/hub.png");
}

function setup() {
  createCanvas(windowWidth - 5, windowHeight - 5);
  switchGameState(GAME_STATES.GAME_HUB);
}

function windowResized() {
  resizeCanvas(windowWidth - 5, windowHeight - 5);
}

function draw() {
  background(50);
  image(bg, 0, 0, windowWidth, windowHeight);

  for (let i = entities.length - 1; i >= 0; --i) {
    const entity = entities[i];
    entity.update();
    entity.draw();
  }

  // debug
  //text(player.x + "," + player.y, 15, 15);
}

function switchGameState(newGameState) {
  if (newGameState < 0 || newGameState > 3) {
    alert("wtf wrong game state, stop hacking my game Madge");
    return;
  }

  let initMainMenu = () => {};
  let initHappyBirthday = () => {};
  let initGameHub = () => {
    // bg
    bg = assets["hub"];

    // player
    player = new Player(1000, 800);
    entities.push(player);

    // npcs
    entities.push(new NPC(495, 735, assets["girl_hub_idle"]));
  };
  let initGameTavern = () => {};

  player = undefined;
  state = newGameState;
  entities = [];

  [initMainMenu, initHappyBirthday, initGameHub, initGameTavern][newGameState]();
}

function keyPressed() {
  // Spacebar
  if (player && player.isHavingS && keyCode === 32)
    player.pushBar();
  if (player && player.canHaveS && keyCode == 70)
    player.startS();
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.img = assets["player"];

    // S feature
    this.canHaveS = undefined;
    this.isHavingS = false;
    this.barWidth = 20;
    this.barHeight = 140;
    this.barCurrent = 0;
    this.barMax = 100;
  }
  update() {
    this.handleInput();

    if (this.isHavingS) {
      this.canHaveS = undefined;
      this.barCurrent -= this.barCurrent < 25 ? 1.6 * 1/deltaTime :
                         this.barCurrent < 50 ? 6.7 * 1/deltaTime :
                         this.barCurrent < 80 ? 12.4 * 1/deltaTime :
                                                18  * 1/deltaTime;
      
      if (this.barCurrent < 0)
        this.barCurrent = 0;
    }
  }
  draw() {
    image(this.img, this.x, this.y);

    if (this.isHavingS)
      this.drawBar();
    if (this.canHaveS)
      this.drawSTooltip();
  }
  handleInput() {
    if (this.isHavingS) return;

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      if (state == 2) 
      {
        if (this.y < 0) ;
        else if (this.y == 645 && this.x < 410) ;
        else this.y -= 5;
      }
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      if (this.y > 865) ;
      else if (this.y == 150 && this.x < 410) ;
      else this.y += 5;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      if (this.x > 1800) ;
      else this.x += 5;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      if (state == 2) 
      {
        if (this.x < 5) ;
        else if (this.x == 410 && this.y < 635 && this.y > 150) ;
        else this.x -= 5;
      }
    }
  }
  startS() {
    this.canHaveS = undefined;
    this.isHavingS = true;
  }
  drawBar() {
    push();
      stroke(2);
      rect(this.x + 120, this.y - this.barHeight/2, this.barWidth, this.barHeight);
      push();
        fill(this.barCurrent / 100 * 255, 255 - (this.barCurrent / 100 * 255), 0);
        const offset = 2;
        let ratio = this.barHeight / 100;
        rect(this.x + 120 + offset, this.y + this.barHeight/2, this.barWidth - offset*2, -this.barCurrent * ratio);
      pop();
    pop();
  }
  drawSTooltip() {
    push();
    strokeWeight(2);
    stroke(0);
    fill(255);
    text("Press F to have Sex.", this.x, this.y - 40);
    pop();
  }
  pushBar() {
    if (!this.isHavingS) return;

    this.barCurrent += (6 + Math.random() * 6) | 0;
    if (this.barCurrent >= this.barMax)
      this.ejaculate();
  }
  ejaculate() {
    this.isHavingS = false;
    this.barCurrent = 0;

    explode(this.x, this.y);
  }
}
class NPC {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
  }
  update() {
    player.canHaveS = (getDistance(this.x, this.y, player.x, player.y) < 100) ? this : player.canHaveS == this ? undefined: player.canHaveS;
  }
  draw() {
    image(this.img, this.x, this.y);
  }
}
class Cum {
 constructor(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.gravity = 0;
  this.size = 3 + (Math.random() * 5) | 0;
 }
 update() {
  this.gravity += (1/deltaTime) * 16;
  this.x += this.velX * 1/deltaTime;
  this.y += (this.velY + this.gravity) * 1/deltaTime;
 }
 draw() {
  push();
  fill(255);
  stroke(0);
  circle(this.x, this.y, this.size);
  pop();
  }
}

function explode(x, y, amount = 125, vForce = 45, yForce = 40) {
  for (let i = 0; i < amount; ++i)
    entities.push(new Cum(x, y, -vForce + Math.random() * vForce * 2, -(yForce + Math.random() * yForce * 2)));
}
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); 
}