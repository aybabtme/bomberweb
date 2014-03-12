var Keyboard = function() {
  var that = {};

  that.W = 87,
  that.A = 65,
  that.S = 83,
  that.D = 68,
  that.Up = 38,
  that.Down = 40,
  that.Left = 37,
  that.Right = 39,
  that.Space = 32;

  var mapping = {};
  var handler = function(event){};

  document.onkeydown = function(ev) {
    if (mapping[ev.keyCode] != null) {
      handler(mapping[ev.keyCode]);
      return false;
    }
    return true;
  };

  that.map = function(key, val) {
    mapping[key] = val
    return that;
  };

  that.handler = function(f) {
    handler = f;
  };

  return that;
};
