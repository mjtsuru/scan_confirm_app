//CANVAS_HEIGHT = 720;
//CANVAS_WIDTH = 1280;
CANVAS_HEIGHT = 372;
CANVAS_WIDTH = 240;
CANVAS_UPPER_X = 100;
CANVAS_LEFT_X = 100;
CANVAS_LEFTEND_MARGIN = 100;
CANVAS_MARGIN = 20;

function setup() {
  //fullscreen(); //MBP 2560 x 1600
  cnv_1 = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  img = loadImage('data/test.png'); //720 x 1115
  done = loadImage('data/done.png'); //2237 × 836
  background(51);
  cnv_2 = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  img = loadImage('data/test.png'); //720 x 1115
  done = loadImage('data/done.png'); //2237 × 836
  background(51);
  //cnv = createCanvas(100, 100);
  cnv_1.mouseOver(Selected);
  cnv_1.mouseOut(Disselected);

  //place the canvases
  cnv_1.position(CANVAS_LEFTEND_MARGIN, CANVAS_UPPER_X);
  cnv_2.position(CANVAS_LEFTEND_MARGIN + CANVAS_WIDTH + CANVAS_MARGIN, CANVAS_UPPER_X);
  tint_val = 255;

}

function draw() {
  tint(tint_val, tint_val);
  image(img, 0, 0, img.width / 3, img.height / 3);
  tint(255, 255);
  image(done, 0, 100, done.width / 10, done.height / 10);
}

function Selected() {
  console.log("mouse over");
  tint_val = 127;
}

function Disselected() {
    console.log("mouse out");
  tint_val = 255;
}

var sketch1 = function(p) {
  img = p.loadImage('data/test.png'); //720 x 1115
  done = p.loadImage('data/done.png'); //2237 × 836
  p.setup = function() {
    p.createCanvas(CANVAS_HEIGHT, CANVAS_WIDTH);
    p.background(125);
  };

  p.draw = function() {
    p.tint(tint_val, tint_val);
    p.image(img, 0, 0, img.width / 3, img.height / 3);
    p.tint(255, 255);
    p.image(done, 0, 100, done.width / 10, done.height / 10);
  };
};

var sketch2 = function(p) {
p.setup = function() {
  p.createCanvas(200, 200);
  p.background(200);
};

p.draw = function() {
  p.fill(0);
  p.stroke(0);
  p.ellipse(50, 50, 50, 50);
};
};

new p5(sketch1, "container1");
new p5(sketch2, "container2");
