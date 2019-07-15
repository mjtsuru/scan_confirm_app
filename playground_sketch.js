//For Reception

CANVAS_BACK_W = 2550;
CANVAS_BACK_H = 1440;

SCAN_IMG_W = 720;
SCAN_IMG_H = 1115;
SCAN_IMG_DIV = 3.78;
SCAN_IMG_X_ZERO = 32;
SCAN_IMG_Y_ZERO = 409;
SCAN_IMG_X_PADDING = 204;

STATUS_H = 32;

CANVAS_HEIGHT = 372;
CANVAS_WIDTH = 240;
CANVAS_UPPER_X = 100;
CANVAS_LEFT_X = 100;
CANVAS_LEFTEND_MARGIN = 100;
CANVAS_MARGIN = 20;

var tint_val_scan1 = 255;
var tint_val_scan2 = 255;

IMG_NUMBER = 6;

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
// socket.on('message', function(msg, ack) {
//   console.log(msg);
//   var msg = JSON.parse(msg);
//
//   if (msg.device == 1) {
//     if (scan1_status == SCAN1_STATUS_DOING) {
//       img_scan1_src = "scanned_buffer/" + msg.filename;
//       console.log('scan1_status to loading');
//       scan1_status = SCAN1_STATUS_LOADING;
//     }
//   } else if (msg.device == 2) {
//     if (scan2_status == SCAN2_STATUS_DOING) {
//       img_scan2_src = "scanned_buffer/" + msg.filename;
//       console.log('scan2_status to loading');
//       scan2_status = SCAN2_STATUS_LOADING;
//     }
//   }
//
//   ack('client ack for send');
// });
var cnv_back;
let song;
var img_slot = new Array(IMG_NUMBER);
var img_slot_names = new Array(IMG_NUMBER);

KEY_STATE_IDLE = 0;
KEY_STATE_BUSY = 1;
var keyState = KEY_STATE_IDLE;

var sketchBack = function(p) {
  img_back = p.loadImage('data/scan_back_y.png');
  var w = SCAN_IMG_W / SCAN_IMG_DIV;
  var h = SCAN_IMG_H / SCAN_IMG_DIV;

  for (var i = 0; i < IMG_NUMBER;i++) {
    img_slot[i] = p.loadImage('data/dummy_y.png');
  }
  p.setup = function() {
    cnv_back = p.createCanvas(CANVAS_BACK_W / 2, CANVAS_BACK_H / 2);
    p.background(0);
    p.image(img_back, 0, 0, CANVAS_BACK_W / 2, CANVAS_BACK_H / 2);

    for (let i in img_slot) {
      p.image(img_slot[i], SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING * i, SCAN_IMG_Y_ZERO, w, h);
    }

  };
  p.draw = function() {
    //Change image src after scan

    //Exec Display
    p.image(img_back, 0, 0, CANVAS_BACK_W / 2, CANVAS_BACK_H / 2);
    for (let i in img_slot) {
      p.image(img_slot[i], SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING * i, SCAN_IMG_Y_ZERO, w, h);
    }

    if (keyState != KEY_STATE_BUSY) {
      if (p.keyIsPressed) {
        if (p.key == 'a') {
          keyState = KEY_STATE_BUSY;
          OnSendClickDev1(p);
        } else if (p.key == 'l') {
          keyState = KEY_STATE_BUSY;
          OnSendClickDev2(p);
        }
      }
    }
  };
}

var flg_refresh = false;
var task = function(p) {
  socket.on('message', function(msg, ack) {
    console.log(msg);
    var msg = JSON.parse(msg);

    if (msg.device) {
      keyState = KEY_STATE_IDLE;
      for (var i = 0; i < img_slot_names.length; i++) {
        if (img_slot_names[i] == "doing") {
          img_slot[i] = p.loadImage("scanned_buffer/" + msg.filename);
          img_slot_names[i] = "scanned_buffer/" + msg.filename;
          img_status[i] = p.loadImage("data/batsu_y.png");
          break;
        }
      }
      console.log(img_slot_names);
    }

    ack('client ack for send');
  });

  p.draw = function() {
    if (flg_refresh) {
      console.log("refresh");
      for (var i = 0; i < img_slot_names.length; i++) {
        if (img_slot_names[i] == null) {
          img_slot[i] = p.loadImage("data/dummy_y.png");
          img_status[i] = p.loadImage("data/ok_y.png");
        }
      }
      console.log("refresh done");
      flg_refresh = false;
    }
  }
}
var scan1_status_change_done = 0;
var img_status = new Array(IMG_NUMBER);
var sketch1_status = function(p) {
  img_status[0] = p.loadImage('data/ok_y.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    var cnv_w = SCAN_IMG_W / SCAN_IMG_DIV;
    var cnv_h = STATUS_H;
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    cnv.position(SCAN_IMG_X_ZERO, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnClickBatsu0);
  };
  p.draw = function() {
    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_status[0], 0, 0, p.width, p.height)
  }
}

var sketch2_status = function(p) {
  img_status[1] = p.loadImage('data/ok_y.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    var cnv_w = SCAN_IMG_W / SCAN_IMG_DIV;
    var cnv_h = STATUS_H;
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    cnv.position(SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING * 1, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnClickBatsu1);
  };
  p.draw = function() {
    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_status[1], 0, 0, p.width, p.height)
  }
}

var sketch3_status = function(p) {
  img_status[2] = p.loadImage('data/ok_y.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    var cnv_w = SCAN_IMG_W / SCAN_IMG_DIV;
    var cnv_h = STATUS_H;
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    cnv.position(SCAN_IMG_X_ZERO+ SCAN_IMG_X_PADDING * 2, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnClickBatsu2);
  };
  p.draw = function() {
    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_status[2], 0, 0, p.width, p.height)
  }
}

var sketch4_status = function(p) {
  img_status[3] = p.loadImage('data/ok_y.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    var cnv_w = SCAN_IMG_W / SCAN_IMG_DIV;
    var cnv_h = STATUS_H;
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    cnv.position(SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING * 3, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnClickBatsu3);
  };
  p.draw = function() {
    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_status[3], 0, 0, p.width, p.height)
  }
}

var sketch5_status = function(p) {
  img_status[4] = p.loadImage('data/ok_y.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    var cnv_w = SCAN_IMG_W / SCAN_IMG_DIV;
    var cnv_h = STATUS_H;
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    cnv.position(SCAN_IMG_X_ZERO + SCAN_IMG_X_PADDING * 4, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnClickBatsu4);
  };
  p.draw = function() {
    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_status[4], 0, 0, p.width, p.height)
  }
}

var sketch6_status = function(p) {
  img_status[5] = p.loadImage('data/ok_y.png');
  song = p.loadSound('data/shinkazoku.wav');
  p.setup = function() {
    var cnv_w = SCAN_IMG_W / SCAN_IMG_DIV;
    var cnv_h = STATUS_H;
    cnv = p.createCanvas(SCAN_IMG_W / SCAN_IMG_DIV, STATUS_H);
    cnv.position(SCAN_IMG_X_ZERO + + SCAN_IMG_X_PADDING * 5, SCAN_IMG_Y_ZERO - STATUS_H);
    cnv.mouseOver(Status1_Selected);
    cnv.mouseOut(Status1_Diselected);
    cnv.mousePressed(OnClickBatsu5);
  };
  p.draw = function() {
    p.tint(tint_val_scan1, tint_val_scan1);
    p.image(img_status[5], 0, 0, p.width, p.height)
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

function OnClickBatsu0() {
  //remove buffer msg to the Server
  console.log("OnClickBatsu0");
  socket.emit('rem_buf', img_slot_names[0], function onack(res) {
    console.log(res);
  });

  img_slot_names[0] = null;
  console.log(img_slot_names);
  flg_refresh = true;

}

function OnClickBatsu1() {
  //remove buffer msg to the Server
  console.log("OnClickBatsu1");
  socket.emit('rem_buf', img_slot_names[1], function onack(res) {
    console.log(res);
  });

  img_slot_names[1] = null;
  console.log(img_slot_names);
  flg_refresh = true;

}

function OnClickBatsu2() {
  //remove buffer msg to the Server
  console.log("OnClickBatsu2");
  socket.emit('rem_buf', img_slot_names[2], function onack(res) {
    console.log(res);
  });

  img_slot_names[2] = null;
  console.log(img_slot_names);
  flg_refresh = true;

}

function OnClickBatsu3() {
  //remove buffer msg to the Server
  console.log("OnClickBatsu3");
  socket.emit('rem_buf', img_slot_names[3], function onack(res) {
    console.log(res);
  });

  img_slot_names[3] = null;
  console.log(img_slot_names);
  flg_refresh = true;

}

function OnClickBatsu4() {
  //remove buffer msg to the Server
  console.log("OnClickBatsu0");
  socket.emit('rem_buf', img_slot_names[4], function onack(res) {
    console.log(res);
  });

  img_slot_names[4] = null;
  console.log(img_slot_names);
  flg_refresh = true;

}

function OnClickBatsu5() {
  //remove buffer msg to the Server
  console.log("OnClickBatsu5");
  socket.emit('rem_buf', img_slot_names[5], function onack(res) {
    console.log(res);
  });

  img_slot_names[5] = null;
  console.log(img_slot_names);
  flg_refresh = true;

}


function OnSendClickDev1(p) {
  console.log("sending dev1 scan msg");
  scan1_status = SCAN1_STATUS_DOING;

  for (var i = 0; i < img_slot_names.length; i++) {
    if (img_slot_names[i] == null || img_slot_names[i] == undefined) {
      if (song.isPlaying()) {
        // .isPlaying() returns a boolean
        song.stop();
      } else {
        song.play();
      }
      img_status[i] = p.loadImage("data/doing_y.png");
      img_slot_names[i] = "doing";
      break;
    }
  }
  console.log(img_slot_names);
  socket.send('scan_device1',function onack(res) {
    console.log(res);
  });
};

function OnSendClickDev2(p) {
  console.log("sending dev2 scan msg");
  scan2_status = SCAN2_STATUS_DOING;

  for (var i = 0; i < img_slot_names.length; i++) {
    if (img_slot_names[i] == null || img_slot_names[i] == undefined) {
      if (song.isPlaying()) {
        // .isPlaying() returns a boolean
        song.stop();
      } else {
        song.play();
      }
      img_status[i] = p.loadImage("data/doing_y.png");
      img_slot_names[i] = "doing";
      break;
    }
  }
  socket.send('scan_device2',function onack(res) {
    console.log(res);
  });
};

function Status2_Selected() {
  console.log("Status2 mouse over");
  tint_val_scan2 = 127;
}

function Status2_Diselected() {
  console.log("Status2 mouse out");
  tint_val_scan2 = 255;
}

new p5(sketchBack, "container0");
new p5(task, "container1");
new p5(sketch1_status, "container3");
new p5(sketch2_status, "container4");
new p5(sketch3_status, "container5");
new p5(sketch4_status, "container6");
new p5(sketch5_status, "container7");
new p5(sketch6_status, "container8");
