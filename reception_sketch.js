//For Reception

CANVAS_BACK_W = 1920;
CANVAS_BACK_H = 1080;

SCAN_IMG_W = 720;
SCAN_IMG_H = 1115;
SCAN_IMG_DIV = 3.28;
SCAN_IMG_X_ZERO = 44;
SCAN_IMG_Y_ZERO = 172;
SCAN_IMG_X_PADDING = 652;

STATUS_H = 32;

CANVAS_HEIGHT = 372;
CANVAS_WIDTH = 240;
CANVAS_UPPER_X = 100;
CANVAS_LEFT_X = 100;
CANVAS_LEFTEND_MARGIN = 100;
CANVAS_MARGIN = 20;

var tint_val_scan1 = 255;
var tint_val_scan2 = 255;

var img_scan1_src;
SCAN1_STATUS_OK = 0;
SCAN1_STATUS_DOING = 1;
SCAN1_STATUS_LOADING = 2;
SCAN1_STATUS_LOADED = 3;
SCAN1_STATUS_BATSU = 4;
var scan1_status = SCAN1_STATUS_OK;

var img_scan2_src;
SCAN2_STATUS_OK = 0;
SCAN2_STATUS_DOING = 1;
SCAN2_STATUS_LOADING = 2;
SCAN2_STATUS_LOADED = 3;
SCAN2_STATUS_BATSU = 4;
var scan2_status = SCAN2_STATUS_OK;


var socket = io();
socket.on('message', function(msg, ack) {
  console.log(msg);
  var msg = JSON.parse(msg);

  if (msg.device == 1) {
    if (scan1_status == SCAN1_STATUS_DOING) {
      img_scan1_src = "scanned_buffer/" + msg.filename;
      console.log('scan1_status to loading');
      scan1_status = SCAN1_STATUS_LOADING;
    }
  } else if (msg.device == 2) {
    if (scan2_status == SCAN2_STATUS_DOING) {
      img_scan2_src = "scanned_buffer/" + msg.filename;
      console.log('scan2_status to loading');
      scan2_status = SCAN2_STATUS_LOADING;
    }
  }

  ack('client ack for send');
});

function sketchFuncs(p) {

}

//var socket = io();

var cnv_back;
let song;
var sketchBack = function(p) {
  img_back = p.loadImage('data/scan_back_g.png');
  p.setup = function() {

    cnv_back = p.createCanvas(CANVAS_BACK_W / 2, CANVAS_BACK_H / 2);
    p.background(0);
    p.image(img_back, 0, 0, CANVAS_BACK_W / 2, CANVAS_BACK_H / 2);
  };
  p.draw = function() {
    p.image(img_back, 0, 0, CANVAS_BACK_W / 2, CANVAS_BACK_H / 2);
  };
}


var sketch1 = function(p) {
  img_scan1 = p.loadImage('data/dummy_g.png'); //720 x 1115
  //done = p.loadImage('data/done.png'); //2237 × 836
  p.setup = function() {
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, SCAN_IMG_H / SCAN_IMG_DIV);
    p.background(0);
    cnv.position(SCAN_IMG_X_ZERO, SCAN_IMG_Y_ZERO);
  };

  p.draw = function() {

    if (scan1_status == SCAN1_STATUS_LOADED) {
      img_scan1 = p.loadImage(img_scan1_src);
      scan1_status = SCAN1_STATUS_BATSU;
    }

    p.image(img_scan1, 0, 0, p.width, p.height);
  };
};

var sketch2 = function(p) {
  img_scan2 = p.loadImage('data/dummy_g.png'); //720 x 1115
  //done = p.loadImage('data/done.png'); //2237 × 836
  p.setup = function() {
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, SCAN_IMG_H / SCAN_IMG_DIV);
    p.background(0);
    cnv.position(SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING, SCAN_IMG_Y_ZERO);
  };

  p.draw = function() {
    if (scan2_status == SCAN2_STATUS_LOADED) {
      img_scan2 = p.loadImage(img_scan2_src);
      scan2_status = SCAN2_STATUS_BATSU;
    }
    p.image(img_scan2, 0, 0, p.width, p.height);
  };
};

var scan1_status_change_done = 0;
var sketch1_status = function(p) {
  img_1_status = p.loadImage('data/ok_g.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    p.background(255);
    cnv.position(SCAN_IMG_X_ZERO, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnSendClickDev1);
  };
  p.draw = function() {
    if (scan1_status == SCAN1_STATUS_DOING) {
      if (scan1_status_change_done == 0) {
        img_1_status = p.loadImage('data/doing_g.png');
        scan1_status_change_done = 1;
      }
    } else if (scan1_status == SCAN1_STATUS_LOADING) {
      img_1_status = p.loadImage('data/batsu_g.png');
      console.log('scan1_status to loaded');
      scan1_status = SCAN1_STATUS_LOADED;
      scan1_status_change_done = 0;
    } else if (scan1_status == SCAN1_STATUS_LOADED) {
      if (scan1_status_change_done == 0) {
        console.log('change status img to BATSU');
        scan1_status_change_done = 1;
      }
    }

    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_1_status, 0, 0, p.width, p.height)
  }

}

function Status1_Selected() {
  console.log("Status1 mouse over");
  tint_val_scan1 = 127;
}

function Status1_Diselected() {
  console.log("Status1 mouse out");
  tint_val_scan1 = 255;
}

function OnSendClickDev1() {
  console.log("sending dev1 scan msg");
  scan1_status = SCAN1_STATUS_DOING;

  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();

  } else {
    song.play();

  }

  socket.send('scan_device1',function onack(res) {
    console.log(res);
  });
};

var scan2_status_change_done = 0;
var sketch2_status = function(p) {
  img_2_status = p.loadImage('data/ok_g.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    p.background(255);
    cnv.position(SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status2_Selected);
    cnv.mouseOut(Status2_Diselected);
    cnv.mousePressed(OnSendClickDev2);
  };
  p.draw = function() {
    if (scan2_status == SCAN2_STATUS_DOING) {
      if (scan2_status_change_done == 0) {
        img_2_status = p.loadImage('data/doing_g.png');
        scan2_status_change_done = 1;
      }
    } else if (scan2_status == SCAN1_STATUS_LOADING) {
      img_2_status = p.loadImage('data/batsu_g.png');
      console.log('scan1_status to loaded');
      scan2_status = SCAN2_STATUS_LOADED;
      scan2_status_change_done = 0;
    } else if (scan2_status == SCAN2_STATUS_LOADED) {
      if (scan2_status_change_done == 0) {
        console.log('change status img to BATSU');
        scan2_status_change_done = 1;
      }
    }

    p.tint(tint_val_scan2, tint_val_scan2);
    p.image(img_2_status, 0, 0, p.width, p.height)
  }
}

function Status2_Selected() {
  console.log("Status2 mouse over");
  tint_val_scan2 = 127;
}

function Status2_Diselected() {
  console.log("Status2 mouse out");
  tint_val_scan2 = 255;
}

function OnSendClickDev2() {
  console.log("sending dev2 scan msg");
  scan2_status = SCAN2_STATUS_DOING;

  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();

  } else {
    song.play();

  }

  socket.send('scan_device2',function onack(res) {
    console.log(res);
  });
};


new p5(sketchBack, "container0");
new p5(sketch1, "container1");
new p5(sketch2, "container2");
new p5(sketch1_status, "container3");
new p5(sketch2_status, "container4");