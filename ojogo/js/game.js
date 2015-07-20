var pcomp;
var obstacles = [];
var gamerunning = true;
var dt=0;
var score = 0;
var lastPosition = 0;

function main () {
  reganim('anim/walk/', 10);
  reganim('anim/getup/', 4);
  reganim('anim/jump/', 3);
  reganim('anim/stop/', 1);
  reganim('anim/coin/', 14);
  html5.loadImage('anim/stone.png', 'stone');
  html5.loadImage('anim/tree.png', 'tree');
  html5.loadImage('anim/boat.png', 'boat');
  html5.loadImage('anim/bigstone.png', 'bigstone');
  html5.loadImage('anim/lamp.png', 'lamp');
  html5.loadImage('anim/fence0.png', 'fence0');
  html5.loadImage('anim/fence1.png', 'fence1');
  html5.loadImage('anim/fence2.png', 'fence2');
  html5.loadImage('anim/build0.png', 'build0');
  html5.loadImage('anim/build1.png', 'build1');
  html5.loadImage('anim/build2.png', 'build2');

  html5.loadImage('anim/a-up.png', 'a-up');
  html5.loadImage('anim/space.png', 'space');
  html5.loadImage('anim/title.png', 'title');
  html5.loadImage('anim/lost.png', 'lost');

  html5.loadImage('anim/back.png', 'background');

  html5.loadAudio('audio/coin.wav', 'coin');
  html5.loadAudio('audio/jump.wav', 'jump');
  html5.loadAudio('audio/land.wav', 'land');

  html5.getCanvas2dContext();

  html5.onLoad = function () {
    html5.enableInput();

    html5.context.scale(2, 2);

    beginGame();

    setTimeout (update, 0);
  }
}

function addObstacles () {
  for (var i=0;i<50;i++) {
    var o;

    if (Math.random() < 0.3) {
      o = new Coin(lastPosition);
    } else if (Math.random() < 0.8) {
      o = new Obstacle(['stone', 'tree', 'bigstone', 'lamp', 'fence0', 'fence1', 'fence2'][Math.floor(Math.random()*7)], lastPosition);
    } else {
      o = new Obstacle(['build0', 'build1', 'build2'][Math.floor(Math.random()*3)], lastPosition, true);
    }
    obstacles.push(o);
    lastPosition = o.p[0];
  }
}

function beginGame () {
  pcomp = new Player ();
  obstacles = [];
  gamerunning = true;
  score = 0;
  lastPosition = html5.canvas.width/2;
  addObstacles();
}

var st = new Date()/1000;
var pdate = 0;

function update () {
  dt = new Date()/1000 - st;
  st = new Date()/1000;

  html5.context.clearRect(0, 0,
                          html5.canvas.width/2,
                          html5.canvas.height/2);

  html5.context.drawImage(html5.image('background'),
  						  0, 0);

  html5.context.fillStyle = "#ffff00";
  html5.context.textBaseline = 'top';
  html5.context.textAlign = 'left';
  html5.context.font = '10px monospace';
  html5.context.fillText (score.toString(), 0, 0);

  if (pcomp.animation == pcomp.aStop) {
    var img = html5.image('title');
    html5.context.drawImage(img, html5.canvas.width/4-img.width/2, 20+Math.sin(new Date()/1000)*20);

    img = html5.image('a-up');
    html5.context.drawImage(img, html5.canvas.width/4-img.width/2, html5.canvas.height/2-40-img.height+Math.sin(new Date()/80)*20);
  }

  for (var i=0;i<obstacles.length;i++) {
    var result = obstacles[i].draw(pcomp.moving() && gamerunning, pcomp.p);

    if (result == 1 && gamerunning) {
      gamerunning = false;
      pdate = new Date()/1000;
    }

    if (obstacles[i].p[0] < -obstacles[i].width() || result == 2) {
      obstacles.splice(i,1);
      i--;
      score += 10;
    }
  }

  pcomp.draw();

  if (obstacles.length < 50) {
    addObstacles();
  }

  if (!gamerunning) {
    var img;

    img = html5.image('space');
    html5.context.save();
    var s = Math.sin(new Date()/80)*0.1+1;
    html5.context.scale(s, s);
    html5.context.drawImage(img, (html5.canvas.width/4)/s-img.width/2, (html5.canvas.height/2-60)/s-img.height/2);
    html5.context.restore();

    img = html5.image('lost');
    html5.context.drawImage(img, html5.canvas.width/4-img.width/2, 20+Math.sin(new Date()/1000)*20);
  }

  if (!gamerunning && html5.keyboard[html5.keySpace] && ((new Date()/1000)-pdate > 1)) {
    beginGame();
  }

  var time = 1000/60-dt*1000;

  if (time < 0)
    time = 0;

  setTimeout (update, 0);
}
