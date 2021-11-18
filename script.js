//author: Mina Rezkallah
//email: mwrezkallah@gmail.com
//mob: +2 01211988436
function main() {
    var canvas = document.getElementById("ProjectileVisualizer");
    var ctx = canvas.getContext("2d");
    //userInput
    var v = document.getElementById("velocity");
    var a = document.getElementById("angle");
    var velocity = Number(v.value);
    var angle = Number(a.value);
    var numberOfPoints = document.getElementById("points");
    var points = Number(numberOfPoints.value) || 100;
    var vizualizationTime = document.getElementById("vizualizationTime");
    var vzTime = Number(vizualizationTime.value) * 1000 / points || 200;
    var startBtn = document.getElementById("start");
    startBtn.disabled = true;
    var resetBtn = document.getElementById("reset");
    resetBtn.disabled = false;
    var resultTable = document.getElementById("results");
    resultTable.style.display = "table";
    var projectile = new Projectile(angle, velocity, points);
    var xMax = document.getElementById("totalDistance");
    xMax.innerHTML = "" + projectile.getTotalDistance().toFixed(3);
    var hMax = document.getElementById("hmax");
    hMax.innerHTML = "" + projectile.getMaxHeight().toFixed(3);
    var tMax = document.getElementById("tmax");
    tMax.innerHTML = "" + projectile.getFlightTIme().toFixed(0);
    draw(canvas, ctx, projectile, vzTime);
}
var animationIntervalID;
function draw(canvas, ctx, projectile, time) {
    if (time === void 0) { time = 200; }
    var i = 0;
    animationIntervalID = setInterval(function () {
        update(canvas, ctx, projectile, i);
        if (i == projectile.np)
            clearInterval(animationIntervalID);
        i++;
    }, time);
}
var oldFrame;
function update(canvas, ctx, projectile, i) {
    if (i === void 0) { i = 0; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var coordiantes = projectile.getCoordinates();
    var scaleX = (canvas.width - 20) / projectile.getTotalDistance();
    var scaleY = (canvas.height - 20) / projectile.getMaxHeight();
    displayProjectileData(coordiantes, i, projectile);
    ctx.beginPath();
    if (i > 0)
        ctx.putImageData(oldFrame, 0, 0);
    ctx.arc((canvas.width / 2) - (projectile.getTotalDistance() * scaleX / 2) + (coordiantes[i].x * scaleX), canvas.height - (coordiantes[i].y * scaleY), 1, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(84 20 31)";
    ctx.fill();
    oldFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc((canvas.width / 2) - (projectile.getTotalDistance() * scaleX / 2) + (coordiantes[i].x * scaleX), canvas.height - (coordiantes[i].y * scaleY), 5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(166 81 199 / 59%)";
    ctx.fill();
}
function reset() {
    clearInterval(animationIntervalID);
    var startBtn = document.getElementById("start");
    startBtn.disabled = false;
    var resetBtn = document.getElementById("reset");
    resetBtn.disabled = true;
    var resultTable = document.getElementById("results");
    resultTable.innerHTML = "     \n                    <tr>\n                        <th>#point</th>\n                        <th>X in m</th>\n                        <th>Y in m</th>\n                        <th>Time in seconds</th>\n                    </tr>";
    resultTable.style.display = "none";
    var canvas = document.getElementById("ProjectileVisualizer");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function displayProjectileData(coordinates, i, projectile) {
    var x = "" + coordinates[i].x.toFixed(3);
    var y = "" + coordinates[i].y.toFixed(3);
    var t = "" + (projectile.getFlightTIme() * i / projectile.np).toFixed(0);
    var instanceX = document.getElementById("currentX");
    instanceX.innerHTML = x;
    var instanceY = document.getElementById("currentY");
    instanceY.innerHTML = y;
    var instanceT = document.getElementById("currentTime");
    instanceT.innerHTML = t;
    var resultTable = document.getElementById("results");
    resultTable.innerHTML += "\n                <tr>\n                    <th>" + i + "</th>\n                    <th>" + x + "</th>\n                    <th>" + y + "</th>\n                    <th>" + t + "</th>\n                </tr>\n    ";
}
var Projectile = /** @class */ (function () {
    function Projectile(angle, velocity, points) {
        this.np = points;
        this.init(angle, velocity);
    }
    Projectile.prototype.init = function (angle, velocity) {
        this.angle = (angle / 180) * Math.PI;
        this.velocity = velocity;
        this.vX = this.velocity * Math.cos(this.angle);
        this.vY = this.velocity * Math.sin(this.angle);
        this.totalDistance = velocity * velocity * Math.sin(2 * this.angle) / Projectile.g;
        this.hMax = Math.pow(this.vY, 2) / (2 * Projectile.g);
        this.tMax = 2 * this.vY / Projectile.g;
        this.tHmax = this.vY / Projectile.g;
        this.dt = this.tMax / this.np;
        this.calculatePoints();
    };
    Projectile.prototype.calculatePoints = function () {
        this.points = [];
        this.totalDistance = this.velocity * this.velocity * Math.sin(2 * this.angle) / Projectile.g;
        for (var i = 0; i <= this.np; i++) {
            this.points[i] = { x: this.calcX(i * this.dt), y: this.calcY(i * this.dt) };
        }
    };
    Projectile.prototype.calcX = function (t) { return this.vX * t; };
    Projectile.prototype.calcY = function (t) { return (this.vY * t) - (0.5 * Projectile.g * t * t); };
    Projectile.prototype.reset = function (angle, velocity) { this.init(angle, velocity); };
    Projectile.prototype.getCoordinates = function () { return this.points; };
    Projectile.prototype.getTotalDistance = function () { return this.totalDistance; };
    Projectile.prototype.getMaxHeight = function () { return this.hMax; };
    Projectile.prototype.getFlightTIme = function () { return this.tMax; };
    Projectile.g = 9.81; // gravitational acceleration m/s^2
    return Projectile;
}());
