function Obstacle (img, last, disable) {
  this.img = html5.image(img);
  this.disable = disable;
  this.p = [last+Math.random()*50+120, html5.canvas.height/2-this.img.height];

  this.width = function () {
    return this.img.width;
  }

  this.draw = function (moving, p) {
    html5.context.drawImage(this.img, this.p[0], this.p[1]);

    var w = this.img.width;
    var h = this.img.height;
    var pw = 16;

    if (moving)
      this.p[0] -= 180*dt;

    if (w == 0 && h == 0 || this.disable) {
      return false;
    }

    if (p[0] > this.p[0] && p[0] < this.p[0]+w && p[1]+20 > this.p[1]) {
      return 1;
    }
    if (this.p[0] > p[0] && this.p[0] < p[0]+pw && p[1]+20 > this.p[1]) {
      return 1;
    }

  }
}

function Coin (last) {
  this.animation = new Animation ('anim/coin/', 0.05, 14);

  this.p = [last+Math.random()*16+30, html5.canvas.height/2-16];

  this.width = function () {
    return this.animation.get().width;
  }

  this.draw = function (moving, p) {
    this.animation.update();

    html5.context.drawImage(this.animation.get(), this.p[0], this.p[1]);

    var w = 16;
    var h = 16;
    var pw = 16;

    if (p[0] > this.p[0] && p[0] < this.p[0]+w && p[1]+20 > this.p[1]) {
      this.animation = new Animation('anim/coin/', 0.001, 14);
      score += 100;
      html5.audio('coin').cloneNode().play();
      return 2;
    } else
    if (this.p[0] > p[0] && this.p[0] < p[0]+pw && p[1]+20 > this.p[1]) {
      this.animation = new Animation('anim/coin/', 0.001, 14);
      score += 100;
      html5.audio('coin').play();
      return 2;
    }

    if (moving)
      this.p[0] -= 180*dt;
  }
}

function Player () {
  this.aWalk = new Animation ('anim/walk/', 0.1, 10);
  this.aGetUp = new Animation ('anim/getup/', 0.01, 4);
  this.aJump = new Animation ('anim/jump/', 0.2, 3);
  this.aStop = new Animation ('anim/stop/', 1, 1);

  this.animation = this.aStop;

  this.start = [html5.canvas.width/4, html5.canvas.height/2-20];
  this.p = [html5.canvas.width/4-8, html5.canvas.height/2-20];

  this.jStart = 0;

  this.moving = function () {
    return !(this.animation == this.aStop);
  }

  this.draw = function () {
    this.animation.update();

    if (this.animation == this.aStop &&
        html5.keyboard[html5.keyUp]) {
      this.animation = this.aGetUp;
      this.animation.play();
    }

    if (this.animation == this.aGetUp &&
        this.animation.complete()) {
        this.animation = this.aWalk;
        this.animation.play();
    }

    if (this.animation == this.aJump &&
        this.animation.complete()) {
        this.animation = this.aGetUp;
        this.animation.play();
        html5.audio('land').play();
    }

    if (this.animation == this.aJump) {
      this.p[1] = this.start[1] - 80*Math.sin(Math.PI*(this.animation.now()-this.jStart)/0.6);
    } else {
      this.p[1] = this.start[1];
    }

    if (this.animation == this.aWalk &&
        html5.keyboard[html5.keySpace]) {
        this.animation = this.aJump;
        this.jStart = this.aJump.now();
        this.animation.play();
        html5.audio('jump').play();
    }

    html5.context.drawImage(this.animation.get(), this.p[0], this.p[1]);
  }
}
