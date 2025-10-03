let cloudParticles = []; // particles that form the OPEN CALL text
let textBuffer;
let textOffsetX = 0;
let textOffsetY = 0;
let dx = 0.1; // horizontal velocity
let dy = 0.4; // vertical velocity
let img;
let resetCycle = 36000;
let fadeWindow = 40;
let fading;

async function setup() {
  img = await loadImage("./qr_code.png");

  let cnv = createCanvas(windowWidth, windowHeight);
  let ctx = cnv.canvas.getContext("2d", { willReadFrequently: true });
  // replace the default context with this one
  cnv.drawingContext = ctx;
  textFont("Poppins"); // description font
  textBuffer = createGraphics(width, height);
  textBuffer.pixelDensity(1);

  drawTextBuffer();

  // --- Text-based cloud particles ---
  for (let i = 0; i < 9000; i++) {
    cloudParticles.push(makeParticle());
  }
  noStroke();
  noCursor();
}

function draw() {
  let cycleProgress = frameCount % resetCycle;
  fading = cycleProgress > resetCycle - fadeWindow;

  background(135, 206, 235);
  let s = sin(frameCount * 0.001) / 100;
  // --- Bounce logic (like DVD logo) ---
  textOffsetX += dx - s;
  textOffsetY += dy;

  let margin = 80; // keeps text away from edges

  // Check for bounce on X
  if (textOffsetX > width / 4 - margin || textOffsetX < -width / 4 + margin) {
    dx *= -1;
    for (let p of cloudParticles) p.vx *= -1;
  }

  // Check for bounce on Y
  if (textOffsetY > height / 5 || textOffsetY < -height / 5) {
    dy *= -1;
    for (let p of cloudParticles) p.vy *= -1;
  }

  if (frameCount % 30 === 0) {
    // update every 30 frames (~0.5s at 60fps)
    drawTextBuffer();
    textBuffer.loadPixels();
  }

  // --- Placeholder for image and text in bottom-left corner ---
  let padding = 20;
  let placeholderHeight = height * 0.2;

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
  textSize(22);
  text(
    "HALLWAY MONITOR OPEN CALL \nfor moving image work\n",
    padding + placeholderHeight + 10,
    height - placeholderHeight + 15
  );
  textStyle(NORMAL);
  textSize(18);
  text(
    "Submit : \nhttps://bit.ly/atsp-hall-monitor",
    padding + placeholderHeight + 10,
    height - placeholderHeight / 2
  );

  // Every 10 minutes at 60fps (~36000 frames), reset particles
  if (cycleProgress === 0) {
    fade = false;
    textBuffer.remove(); // free GPU memory
    textBuffer = createGraphics(width, height);
    textBuffer.pixelDensity(1);
    drawTextBuffer();
    textBuffer.loadPixels();

    cloudParticles = [];
    for (let i = 0; i < 6000; i++) {
      cloudParticles.push(makeParticle());
    }
  } else {
    drawMaskedParticles(cloudParticles, textBuffer, 0.3);
  }
}

// --- Particle factory ---
function makeParticle() {
  return {
    x: random(width),
    y: random(height),
    r: random(5, height / 20),
    alpha: 0,
    fadeSpeed: random(0.5, 3),
    fadeOutSpeed: random(5, 10),
    offset: random(TWO_PI),
    vx: random(-0.3, 0.3),
    vy: random(-0.2, 0.2),
    lifespan: 255,
  };
}

// --- Draw particles using a mask (buffer), respecting wind reversals ---
function drawMaskedParticles(particles, buffer, maxAlpha = 0.5) {
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
    if (fading) {
      p.alpha = max(0, p.alpha - 5);
    } else if (inMask) {
      p.alpha = min(255, p.alpha + p.fadeSpeed);
      p.lifespan = 255; // refresh lifespan when inside text
    } else {
      p.alpha = max(0, p.alpha - p.fadeOutSpeed);
      p.lifespan -= 2; // shrink lifespan while fading out
    }

    if (p.alpha > 0) {
      noStroke();
      fill(240, p.alpha * maxAlpha);
      ellipse(
        p.x + sin(frameCount * 0.01 + p.offset) * p.r * 0.3,
        p.y + cos(frameCount * 0.01 + p.offset) * p.r * 0.3,
        p.r
      );

      // Remove & respawn if dead
      if (p.lifespan <= 0 && p.alpha <= 0) {
        p.x = random(width);
        p.y = random(height);
        p.vx = random(-0.3, 0.3);
        p.alpha = 0;
        p.lifespan = 256;
      }
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
