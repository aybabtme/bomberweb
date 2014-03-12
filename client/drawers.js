var WallDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, maxX, maxY)
};

var GroundDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "grey";
    ctx.fillRect(x, y, maxX, maxY)
};

var RockDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "brown";
    ctx.fillRect(x, y, maxX, maxY)
};

var BombDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "orange";
    ctx.fillRect(x, y, maxX, maxY)
};

var FlameDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, maxX, maxY)
};

var PlayerDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "cyan";
    ctx.fillRect(x, y, maxX, maxY)
};

var BombPUDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, maxX, maxY)
};

var RadiusPUDrawer = function(ctx, name, x, y, maxX, maxY) {
    ctx.fillStyle = "pink";
    ctx.fillRect(x, y, maxX, maxY)
};
