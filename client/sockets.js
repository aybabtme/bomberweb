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
