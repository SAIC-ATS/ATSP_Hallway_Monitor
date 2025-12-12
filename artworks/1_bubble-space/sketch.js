// more comments than code hashtag learning and be nice to me
// command D - all instances of text highlighted replaced / updated

// ! means NOT

let washerImg1;
let washerImg2;
let bubbleImg;
let detergentImg;
let basketImg;
let plantImg;
let bgImg;

let wX = 1050;
let wY = 520;

// BOOLEANS

let cycleToggle = 0; // cycleState boolean / "on + off switch"

let cycleState = false; // cycleState switch
let bubblePop = false; //

let bubbleStart = 0; //

// ARRAYS

let bubbles = []; // storage for bubble information / properties

let strings = [];

// CODE START //

function preload() {
  // just for loading assets

  bgImg = loadImage("images/bg.png");

  bubbleImg = loadImage("images/bubble.png");

  washerImg1 = loadImage("images/washer.png");

  washerImg2 = loadImage("images/washer.png");

  detergentImg = loadImage("images/detergent.png");

  basketImg = loadImage("images/basket.png");

  plantImg = loadImage("images/plant.png");
}

function setup() {
  createCanvas(1366, 768);

  imageMode(CENTER);

  // arguments go inside / are fed into parameters
}

function draw() {
  frameRate(30);

  // background(220);

  // console.log(mouseX, mouseY);

  image(bgImg, width / 2, height / 2, width, height);

  image(detergentImg, detergent.x, detergent.y, detergent.size, detergent.size);

  image(basketImg, basket.x, basket.y, basket.size, basket.size);

  image(plantImg, plant.x, plant.y, plant.size, plant.size);

  // image arguments: image(img, x, y, width, height)

  // washer cycle toggle (on/off every interval)
  if (frameCount >= cycleToggle) {
    // if frameCount is greater than or equal to 0 (cycleToggle)...

    cycleState = !cycleState;
    // flip the washer on/off: if it was on, turn it off; if it was off, turn it on ...

    frameInterval = floor(random(1000, 10));

    // pick a new random interval for the next toggle, between 1000 and 3000 frames
    // "frameInterval" so we dont gotta type allat

    cycleToggle = frameCount + frameInterval;

    // grabs current frame then adds a random value between 500 - 1000 for us to wait between cycleState
  }

  if (cycleState) {
    image(washerImg1, wX, wY);

    // adds NEW bubbles to array
    // "new" creates an object from a constructor function

    if (frameCount % 3 === 0) {
      //strict equality ( === ) operator checks whether its two operands are equal, returning a boolean result 0

      bubbles.push(new Bubble(wX, wY));
    }
  } else {
    image(washerImg2, wX, wY);

    // no new bubbles, just showing existing ones
  }

  // bubbles always update + draw, no matter what cycleState is
  for (let i = 0; i < bubbles.length; i++) {
    let b = bubbles[i];

    b.update(); // keep floating even if washer is "off"
    b.spawn(); // always visible
  }

  // clean up bubbles that float off screen

  bubbles = bubbles.filter((b) => {
    //=>means “do this with the stuff in the parentheses"
    // keep every bubble b where b.size is bigger than 5

    let onScreen =
      b.pos.x > 0 && b.pos.x < width && b.pos.y > 0 && b.pos.y < height;

    let hitDetergent =
      dist(b.pos.x, b.pos.y, detergent.x, detergent.y) <
      detergent.size / 2 + b.size / 2;

    // dist is a built-in p5 function that measures how far two points are from each other

    let hitBasket =
      dist(b.pos.x, b.pos.y, basket.x, basket.y) < basket.size / 2 + b.size / 2;

    let hitPlant =
      dist(b.pos.x, b.pos.y, plant.x, plant.y) < plant.size / 2 + b.size / 2;

    return onScreen && !hitDetergent && !hitBasket && !hitPlant;

    //keep the bubble if its still on screen, AND it’s NOT hitting the detergent AND its NOT hitting the basket etc...

    // return is handing back a value to who called it, in this case, onScreen
  });

  // && checks two (or more) conditions and returns true ONLY if all of them are true

  // keep the bubble only if its x position is bigger than 0… (so not off the left side)…
  // and smaller than the width of the canvas (so not off the right side)…
  // and its y position is bigger than 0 (not above the top)…
  // and smaller than the height (not below the bottom).
}

class Bubble {
  // template for one single bubble

  constructor(x, y) {
    // added x + y arguments to the constructor class because we want each bubble to know where it starts!

    this.img = bubbleImg;
    this.pos = createVector(x, y);
    this.size = random(10, 70); // slight size variation
    this.xOff = random(1300); // random noise offsets
    this.speed = random(1, 5); // rising speed

    // "this." calls to constructor properties
  }

  update() {
    // CHANGING / UPDATING properties
    // make the bubbles rise, get bigger, decides if the bubble should pop

    this.pos.y -= this.speed;
    // float upward - no need to map any noise because vertical motion does not need to vary greatly
    // -= subtract and store
    // += add and store
    this.pos.x += map(noise(this.xOff), 0, 1, -14, 3);

    // map(value, start1(a), stop1(b), start2(c), stop2(d))
    // map: take a value that’s between a and b, and stretch or shrink it so it fits between c and d

    this.yOff += 0.05; // slight wobble to bubbles floating upward
  }

  spawn() {
    // method is a function INSIDE of a class
    // SHOWING the properties

    image(this.img, this.pos.x, this.pos.y, this.size, this.size);

    // "this." calls to constructor properties
  }
}

let detergent = {
  x: 150,
  y: 375,
  size: 150, // one value since image is square
};

let basket = {
  x: 480,
  y: 150,
  size: 150,
};

let plant = {
  x: 415,
  y: 500,
  size: 150,
};

// im God you fucking cocksuckers.  i programmed these shits into existence .  each pixel icon hand crafted by ME like  adam  was made with mud and  eve with the rib
