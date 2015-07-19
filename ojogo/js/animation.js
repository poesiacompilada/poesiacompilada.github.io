function reganim (directory, frames) {
  for (var i=0;i<frames;i++) {
    var num = i>9||frames<10?''+i:'0'+i;
    var name = directory+num+".png";
    html5.loadImage(name, name);
  }
}

function Animation (directory, time, frames) {
  this.frames = frames;
  this.directory = directory;
  this.time = time;
  this.img = [];
  this.p = 0;

  // next frame change
  this.nfc = 0;

  this.wraped = false;

  this.now = function () {
    return new Date()/1000;
  }

  this.play = function () {
    this.nfc = this.now()+this.time;
  }

  this.update = function () {
    if (this.now() >= this.nfc) {
      this.changeFrame();

      this.nfc = this.now()+this.time;
    }
  }

  this.changeFrame = function () {
    this.p = (this.p+1)%this.frames;

    if (this.p == 0)
      this.wraped = true;
  }

  this.get = function () {
    return this.img[this.p];
  }

  this.complete = function () {
    if (this.wraped) {
      this.wraped = false;
      return true;
    }
    return false;
  }

  //@construct
  for (var i=0;i<frames;i++) {
    var num = i>9||frames<10?''+i:'0'+i;
    this.img.push(html5.image(directory+num+".png"));
  }
}
