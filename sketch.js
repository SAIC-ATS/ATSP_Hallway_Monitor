let cloudParticles = []; // particles that form the OPEN CALL text
let textBuffer;
let textOffsetX = 0;
let textOffsetY = 0;
let dx = 0.8; // horizontal velocity
let dy = 0.6; // vertical velocity
let img;

async function setup() {
  img = await loadImage("./qr_code.png");

  createCanvas(windowWidth, windowHeight);
  textFont("Poppins"); // description font
  textBuffer = createGraphics(width, height);
  textBuffer.pixelDensity(1);

  drawTextBuffer();

  // --- Text-based cloud particles ---
  for (let i = 0; i < 20000; i++) {
    cloudParticles.push(makeParticle());
  }
}

function draw() {
  background(135, 206, 235);

  // --- Bounce logic (like DVD logo) ---
  textOffsetX += dx;
  textOffsetY += dy;

  let margin = 80; // keeps text away from edges
  let textBounds = width * 0.3; // approximate width of OPEN CALL text

  // Check for bounce on X
  if (textOffsetX > width / 4 - margin || textOffsetX < -width / 4 + margin) {
    dx *= -1;
    // Reverse all particle speeds on X too (wind shift)
    for (let p of cloudParticles) p.vx *= -1;
  }

  // Check for bounce on Y
  if (textOffsetY > height / 5 || textOffsetY < -height / 5) {
    dy *= -1;
    // Reverse all particle speeds on Y too
    for (let p of cloudParticles) p.vy *= -1;
  }

  drawTextBuffer();
  textBuffer.loadPixels();

  // --- Draw OPEN CALL cloud particles ---
  drawMaskedParticles(cloudParticles, textBuffer, 0.8);

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
  fill(255, 200);
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
    r: random(1, height / 15),
    alpha: 0,
    fadeSpeed: random(0.02, 1),
    fadeOutSpeed: random(1, 4),
    offset: random(TWO_PI),
    vx: random(-0.5, 0.5), // give particles their own drift
    vy: random(-0.3, 0.3),
  };
}

// --- Draw particles using a mask (buffer), respecting wind reversals ---
function drawMaskedParticles(particles, buffer, maxAlpha = 0.8) {
  for (let p of particles) {
    // Move according to particle velocities
    p.x += p.vx;
    p.y += p.vy;

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

    // Wrap particles if off screen and invisible
    if (
      (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) &&
      p.alpha === 0
    ) {
      p.x = random(width);
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
