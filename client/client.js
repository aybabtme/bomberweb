var WS = function(url, msgFn) {
  var out = {
     sckt: new WebSocket(url)
  };

  var init = function() {
    out.sckt.onmessage = msgFn;

    out.sckt.onopen = function (event) {
      console.log("Connected" + event);
    };

    out.sckt.onclose = function(event) {
      out.sckt = new WebSocket(url)
      init();
    };
  };
  init();
  return out;
};

var onUpdate = function(event) {
  console.log("UPDATE!", event)
};

var onMove = function(event) {
  console.log("MOVE!", event)
};

var updateSrv = WS("ws://127.0.0.1:3333/p4/ws/update", onUpdate)
var moveSrv = WS("ws://127.0.0.1:3333/p4/ws/move", onMove)
