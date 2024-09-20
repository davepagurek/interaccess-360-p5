// Turn on preview mode to use lower res
const PREVIEW = true;
const WRAP_MARGIN = 200;

// Double-click to toggle fullscreen
function doubleClicked() {
  fullscreen(!fullscreen());
}

let bg;
function preload() {
  bg = loadImage('https://p5js.org/assets/outdoor_spheremap.jpg');
}

const WEST = [0, 1202];
const NORTH = [WEST[1], WEST[1] + 2638];
const EAST = [NORTH[1], NORTH[1] + 1202];
const SOUTH = [EAST[1], EAST[1] + 2638];

let westFbo, northFbo, eastFbo, southFbo;
let cam, westCam, northCam, eastCam, southCam;
const fovy = Math.PI * 0.16;

function setup() {
  createCanvas(7680, 472, WEBGL);
  if (PREVIEW) {
    setAttributes({ antialias: false });
    pixelDensity(1/4);
  } else {
    // Consider doing a fraction here too if your browser won't let you make textures that big
    pixelDensity(1);
  }
  westFbo = createFramebuffer({ width: 1202, height });
  northFbo = createFramebuffer({ width: 2638, height });
  eastFbo = createFramebuffer({ width: 1201, height });
  southFbo = createFramebuffer({ width: 2638, height });

  push();
  cam = createCamera();
  cam.setPosition(0, 0, 0);
  westCam = westFbo.createCamera();
  northCam = northFbo.createCamera();
  eastCam = eastFbo.createCamera();
  southCam = southFbo.createCamera();
  pop();
}

/**
 * Update the main camera each frame here. The cameras for each wall will
 * be updated based on this one.
 */
function updateCamera() {
  const angleX = map(mouseX, 0, windowWidth, -PI/2, PI/2);
  const angleY = map(mouseY, 0, windowHeight, -PI/2, PI/2);
  const x = 100 * cos(angleX);
  const z = 100 * sin(angleX);
  cam.lookAt(0, 0, 100);
  cam.pan(angleX);
  // cam.tilt(angleY);
}

/**
 * Place content here that you want drawn in a way that will
 * wrap around seamlessly. The content will be rendered four times,
 * once from the perspective of each wall's dedicated camera.
 *
 * Set the background color in draw() and use a clear background here
 * to get the wrapping to work.
 */
function drawWrapped() {
  panorama(bg);
  lights();
  fill('#40ad9b');
  noStroke()
  const t = millis();
  for (let i = 0; i < 40; i++) {
    push();
    const pos = createVector(
      map(noise(i, 0), 0, 1, -1, 1) * height,
      map(noise(i, 100), 0, 1, -1, 1) * height,
    ).setMag(800);
    translate(
      pos.x,
      pos.y,
      sin(t * 0.0001 + i) * 1000,
    );
    sphere(100);
    pop();
  }
}

function draw() {
  updateCamera();

  westFbo.draw(() => {
    westCam.camera(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ, cam.upX, cam.upY, cam.upZ);
    westCam.perspective(fovy, westFbo.width/westFbo.height)
    setCamera(westCam);
    drawWrapped();
  });
  northFbo.draw(() => {
    northCam.camera(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ, cam.upX, cam.upY, cam.upZ);
    northCam.perspective(fovy, northFbo.width/northFbo.height)
    northCam.pan(-PI/2);
    setCamera(northCam);
    drawWrapped();
  });
  eastFbo.draw(() => {
    eastCam.camera(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ, cam.upX, cam.upY, cam.upZ);
    eastCam.perspective(fovy, eastFbo.width/eastFbo.height)
    eastCam.pan(-PI);
    setCamera(eastCam);
    drawWrapped();
  });
  southFbo.draw(() => {
    southCam.camera(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ, cam.upX, cam.upY, cam.upZ);
    southCam.perspective(fovy, southFbo.width/southFbo.height)
    southCam.pan(-3*PI/2);
    setCamera(southCam);
    drawWrapped();
  });

  push();
  translate(-width/2, -height/2);
  imageMode(CORNER);
  image(westFbo, WEST[0], 0);
  image(northFbo, NORTH[0], 0);
  image(eastFbo, EAST[0], 0);
  image(southFbo, SOUTH[0], 0);
  pop();
}