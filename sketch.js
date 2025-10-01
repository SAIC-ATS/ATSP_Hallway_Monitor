let cloudParticles = []; // particles that form the OPEN CALL text
let ambientClouds = []; // drifting ambient cloud masks
let ambientParticles = []; // particles that fill the ambient masks
let textBuffer;
let textOffsetX = 0;
let textOffsetY = 0;
let img;

async function setup() {
  img = await loadImage("./qr_code.png");

  createCanvas(windowWidth, windowHeight);
  textFont("Poppins"); // For description
  textBuffer = createGraphics(width, height);
  textBuffer.pixelDensity(1);

  drawTextBuffer();

  // --- Text-based cloud particles ---
  for (let i = 0; i < 30000; i++) {
    cloudParticles.push(makeParticle());
  }

  // --- Ambient cloud masks ---
  for (let i = 0; i < 1; i++) {
    let buf = createGraphics(width, height);
    buf.pixelDensity(1);
    ambientClouds.push({
      buffer: buf,
      x: width / 4 - random(width / 2),
      y: random(height * 0.15),
      speed: random(0.1, 1.5),
      w: random(width / 7, width / 5),
      h: random(height / 10, height / 4),
      swayOffset: random(TWO_PI),
    });
  }

  // --- Ambient cloud particles ---
  for (let i = 0; i < 5000; i++) {
    ambientParticles.push(makeCloudParticle());
  }
}

function draw() {
  background(135, 206, 235);

  // --- Continuous drift for the text ---
  textOffsetX += 1 + sin(frameCount * 50);
  textOffsetY -= random(-0.05, 0.05);

  // Reset text when off-screen
  let textWidthEstimate = width + "OPEN".length * 1.1;
  if (textOffsetX > textWidthEstimate) {
    textOffsetX = -textWidthEstimate * 0.7;
    textOffsetY = random(0, height / 5);
  }
  drawTextBuffer();
  textBuffer.loadPixels();

  // --- Update ambient cloud buffers ---
  for (let c of ambientClouds) {
    c.x += c.speed;
    if (c.x - c.w > width) {
      c.x = -c.w;
      c.y = random(height * 0.3);
    }
    drawCloudBuffer(c);
    c.buffer.loadPixels();
  }

  // --- Draw OPEN CALL cloud particles ---
  drawMaskedParticles(cloudParticles, textBuffer, 0.8);

  // --- Draw ambient cloud particles (fade by their masks) ---
  for (let c of ambientClouds) {
    drawMaskedParticles(ambientParticles, c.buffer, 0.3);
  }

  // --- Placeholder for image and text in bottom-left corner ---
  let padding = 20;
  let placeholderHeight = height * 0.16;

  push();
  blendMode(MULTIPLY);
  image(
    img,
    padding,
    height - placeholderHeight - padding / 2,
    placeholderHeight,
    placeholderHeight
  );
  pop();

  noStroke();
  fill(255, 150);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(20);
  text(
    "HALLWAY MONITOR OPEN CALL \nfor moving image work\n",
    padding + placeholderHeight + 10,
    height - placeholderHeight
  );
  textStyle(NORMAL);
  textSize(14);
  text(
    "Submit : \nhttps://bit.ly/atsp-hall-monitor",
    padding + placeholderHeight + 10,
    height - placeholderHeight / 2
  );
}

// --- Particle factory ---
function makeParticle() {
  return {
    x: random(width),
    y: random(height),
    r: random(5, height / 25),
    speed: random(0.001, 0.9),
    offset: random(TWO_PI),
    alpha: 0,
    fadeSpeed: random(0.02, 1),
    fadeOutSpeed: random(1, 4),
  };
}

function makeCloudParticle() {
  return {
    x: random(width),
    y: random(height / 2),
    r: random(1, height / 10),
    speed: random(0.001, 1),
    offset: random(TWO_PI),
    alpha: 0,
    fadeSpeed: random(0.2, 0.9),
    fadeOutSpeed: random(0.05, 1),
  };
}

// --- Draw particles using a mask (buffer) ---
function drawMaskedParticles(particles, buffer, maxAlpha = 0.8) {
  for (let p of particles) {
    p.x += p.speed;

    let px = int(p.x);
    let py = int(p.y);

    let inMask = false;
    if (px >= 0 && px < buffer.width && py >= 0 && py < buffer.height) {
      let idx = 4 * (py * buffer.width + px);
      if (buffer.pixels[idx] > 128) inMask = true;
    }

    if (inMask) {
      p.alpha = min(255, p.alpha + p.fadeSpeed);
    } else {
      p.alpha = max(0, p.alpha - p.fadeOutSpeed);
    }

    if (p.alpha > 0) {
      noStroke();
      fill(255, p.alpha * maxAlpha);
      ellipse(
        p.x + sin(frameCount * 0.01 + p.offset) * p.r * 0.3,
        p.y + cos(frameCount * 0.01 + p.offset) * p.r * 0.3,
        p.r
      );
    }

    if (p.x - p.r > width && p.alpha === 0) {
      p.x = -p.r;
      p.y = random(height);
    }
  }
}

// --- Text buffer for OPEN CALL ---
function drawTextBuffer() {
  textBuffer.clear();
  textBuffer.fill(255);
  textBuffer.textAlign(CENTER, CENTER);
  textBuffer.textFont("Fredoka One");
  textBuffer.textSize(width * 0.2);
  textBuffer.textStyle(BOLD);
  textBuffer.drawingContext.letterSpacing = "0.18em";

  let lines = ["OPEN", "  CALL"];
  let lineSpacing = width * 0.18; // adjust vertical space between the words

  for (let i = 0; i < lines.length; i++) {
    textBuffer.text(
      lines[i],
      width / 2 + textOffsetX,
      height / 3 + textOffsetY + i * lineSpacing
    );
  }
}

// --- Cloud mask drawing ---
function drawCloudBuffer(c) {
  c.buffer.clear();
  c.buffer.noStroke();
  c.buffer.fill(255);
  let sway = sin(frameCount * 0.005 + c.swayOffset) * 20;

  for (let i = 0; i < 100; i++) {
    let ex = randomGaussian(c.x, c.w * 0.2);
    let ey = randomGaussian(c.y + sway, c.h * 0.2);
    let er = random(c.w * 0.2, c.w * 0.5);
    c.buffer.ellipse(ex, ey, er, er * 0.7);
  }
}
