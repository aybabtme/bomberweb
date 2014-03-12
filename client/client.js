
var WS = function(url, receiveFn) {
  var out = {
    sckt: new WebSocket(url)
  };

  var init = function() {
    out.sckt.onmessage = receiveFn || function () {};

    out.sckt.onopen = function (event) {
      console.log("Connected" + event);
    };

    out.sckt.onclose = function(event) {
      out.sckt = new WebSocket(url);
      init();
    };

    out.send = function(event) {
      out.sckt.send(event);
    };
  };
  init();
  return out;
};

// Get my canvas yo!
var canvas = document.getElementById('canvas');
var nameToColor = {
  "Wall": "black",
  "Ground": "white",
  "Rock": "yellow",
  "Bomb": "green",
  "Flame": "red",
  "p1": "blue",
  "p2": "blue",
  "p3": "blue",
  "p4": "blue",
}


function draw(state) {
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var widthFactor = canvas.width / state.length;
    var heightFactor = canvas.height / state[0].length;
    for (var i = state.length - 1; i >= 0; i--) {
      for (var j = state[i].length - 1; j >= 0; j--) {
        var cell = state[i][j];
        var x = cell.X * widthFactor;
        var y = cell.Y * heightFactor;
        var name = cell.Name;
        ctx.fillStyle = nameToColor[cell.Name];
        ctx.fillRect(x, y, widthFactor, heightFactor)
      };
    };
  }
}



var onUpdate = function(event) {
  var state = JSON.parse(event.data);
  draw(state.Board);
};


var updateSrv = WS("ws://127.0.0.1:3333/p4/ws/update", onUpdate);
var moveSrv = WS("ws://127.0.0.1:3333/p4/ws/move");

var onMove = function(event) {
  moveSrv.send(event);
};

var w = 87,
    a = 65,
    s = 83,
    d = 68,
    up = 38,
    down = 40,
    left = 37,
    right = 39,
    space = 32;

var keymap = (function() {
  var mapping = {};
  mapping[up] = "up";
  mapping[down] = "down";
  mapping[left] = "left";
  mapping[right] = "right";
  mapping[space] = "bomb";

  return {
    handles: function (key) {
      return mapping[key] != null;
    },
    action: function(key) {
      return mapping[key];
    },
  }
})();


document.onkeydown = function(ev) {

  if (keymap.handles(ev.keyCode)) {
    moveSrv.send(keymap.action(ev.keyCode));
    return false;
  }
  // was consumed, don't propagate event further
  console.log("Unmaped:", ev.keyCode);
  return true;
};
