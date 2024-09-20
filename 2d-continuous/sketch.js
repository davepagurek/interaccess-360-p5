// Turn on preview mode to use lower res
const PREVIEW = false;
const WRAP_MARGIN = 200;

// Double-click to toggle fullscreen
function doubleClicked() {
  fullscreen(!fullscreen());
}

// x value ranges for each screen.
// e.g. the west screen starts at x = WEST[0] and
// ends at x = WEST[1].
const WEST = [0, 1202]
const NORTH = [WEST[1], WEST[1] + 2638]
const EAST = [NORTH[1], NORTH[1] + 1202]
const SOUTH = [EAST[1], EAST[1] + 2638]

let g;

function setup() {
  createCanvas(7680, 472);
  if (PREVIEW) {
    pixelDensity(1/4);
  } else {
    pixelDensity(1);
  }
  g = createGraphics(width + 2*WRAP_MARGIN, height + 2*WRAP_MARGIN);
  g.translate(WRAP_MARGIN, 0);
}

function draw() {
  drawWrapped();

  background('#f5ede1');
  push();
  imageMode(CORNER);
  image(g, -WRAP_MARGIN, 0); // Main canvas
  image(g, -g.width + WRAP_MARGIN, 0); // Left wrap margin
  image(g, g.width - WRAP_MARGIN, 0); // Right wrap margin
  pop();
}

/**
 * Place content here that you want drawn in a way that will
 * wrap around seamlessly. Imagine there is a border on both sides
 * of the graphic you're drawing to that is WRAP_MARGIN px wide, and
 * that border gets folded around to the other side.
 *
 * Set the background color in draw() and use a clear background here
 * to get the wrapping to work.
 */
function drawWrapped() {
  g.clear();
  g.push();
  g.fill('#40ad9b');
  const t = millis();
  for (let i = 0; i < 20; i++) {
    g.push();
    g.circle(
      map(sin(t * 0.0001 + i), -1, 1, 0, width),
      map(i, -1, 20, 0, height),
      200
    );
    g.pop();
  }
  g.pop();
}