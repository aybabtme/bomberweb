var BomberClient = function(canvasId, playerName, raddr) {

  // Get my canvas yo!
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');
  var drawFunc = {
    "Wall": WallDrawer,
    "Ground": GroundDrawer,
    "Rock": RockDrawer,
    "Bomb": BombDrawer,
    "Flame": FlameDrawer,
    "p1": PlayerDrawer,
    "p2": PlayerDrawer,
    "p3": PlayerDrawer,
    "p4": PlayerDrawer,
    "PowerUp(Bomb)": BombPUDrawer,
    "PowerUp(Radius)": RadiusPUDrawer,
  }

  var boardCache;

  function draw(board) {
    var widthFactor = canvas.width / board.length;
    var heightFactor = canvas.height / board[0].length;

    if (boardCache == null) {
      boardCache = new Array(board.length);
      for (var i = boardCache.length - 1; i >= 0; i--) {
        boardCache[i] = new Array(board[0].length)
      };
    }

    var cell, x, maxX, y, maxY, name;
    for (var i = board.length - 1; i >= 0; i--) {
      for (var j = board[i].length - 1; j >= 0; j--) {
        cell = board[i][j];
        name = cell.Name;
        if (boardCache[i][j] == name) {
          continue
        }
        boardCache[i][j] = name

        x = Math.ceil(cell.X * widthFactor);
        y = Math.ceil(cell.Y * heightFactor);
        maxX = Math.ceil(widthFactor)
        maxY = Math.ceil(heightFactor)

        drawFunc[name](ctx, name, x, y, maxX, maxY);
      };
    };
  }

  var endpoint = "ws://"+raddr+"/"+playerName+"/ws";

  var updateSrv = WS(endpoint+"/update", function(e) {
    var state = JSON.parse(e.data);
    draw(state.Board);
  });

  var moveSrv = WS(endpoint+"/move");

  var kb = Keyboard();
  kb.map(kb.Up, "up")
    .map(kb.Down, "down")
    .map(kb.Left, "left")
    .map(kb.Right, "right")
    .map(kb.Space, "bomb")
    .handler(moveSrv.send);

};
