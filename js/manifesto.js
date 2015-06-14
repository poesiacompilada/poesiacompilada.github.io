var draw;

function Typewrite (text) {
  this.text = text;
  this.stm = this.ctm = draw.getTime();
  this.charTime = 0.1;
  this.screenBuffer = "";
  this.p = 0;
  this.drawCursor = true;

  this.draw = function () {
    var now = draw.getTime();

    if (now-this.ctm > 0.25) {
      this.drawCursor = !this.drawCursor;
      this.ctm = now;
    }
    if (this.p < this.text.length) {
      if (now-this.stm > this.charTime) {
        var c = this.text[this.p++];

        if (c == '|')
          this.charTime = 0.5;
        else if (c == '\\') {
          this.screenBuffer += c;
          this.screenBuffer += this.text[this.p++];
          this.charTime = 0;
        } else {
          if (c == ' ')
            html5.audio('type').play();
          else {
            switch (Math.floor(Math.random()*3)) {
              case 0:
                html5.audio('type2').play();
              break;
              case 1:
                html5.audio('type3').play();
              break;
              case 2:
                html5.audio('type4').play();
              break;
            }
          }
          this.screenBuffer += c;
          this.charTime = 0.1;
        }
        this.stm = now;
      }
    } else {
      if (now-this.stm > 1) {
        if (this.onFinish) {
            this.onFinish();
        }
        this.finished = true;
      }
    }

    draw.text(this.screenBuffer, this.text, this.drawCursor || ((now-this.stm) < 0.1));
  }
}

function Draw () {
  this.elements = [];

  this.getTime = function () {
    return new Date()/1000;
  }

  this.setClearColor = function (color) {
    html5.canvas.style.background = color;
  }

  this.setFillColor = function (color) {
    html5.context.fillStyle = color;
  }

  this.clear = function () {
    html5.context.clearRect(0, 0,
                            html5.canvas.width,
                            html5.canvas.height);
  }

  this.removePipe = function (string) {
    var str = string.replace(/\|/g, "").replace(/\\./g, "");
    return str;
  }

  this.drawChar = function (ch, x, y) {
    var len = html5.context.measureText(ch).width;
    html5.context.fillText(ch, x, y);
    return len;
  }

  this.text = function (text, measure, drawCursor) {
    var fontHeight = 20;
    var width = html5.context.measureText(this.removePipe(measure?measure:text)).width;
    //var cursor = measure?html5.context.measureText(this.removePipe(text)).width:null;
    var offset = [(html5.canvas.width-width)/2,
                  (html5.canvas.height-fontHeight)/2]

    var cursor = 0;
    for (var t=0;t<text.length;t++) {
      if (text[t] == '\\') {
        switch (text[++t]) {
          case 'a':
            //this.setFillColor('#524f52');
            this.setFillColor('white');
          break;
          case 'b':
            this.setFillColor('#66D9EF');
          break;
          case 'c':
            this.setFillColor('#F92672');
          break;
          case 'd':
            this.setFillColor('#E6DB74');
          break;
          case 'e':
            this.setFillColor('#75715E');
          break;
          case 'f':
            this.setFillColor('#AE81FF');
          break;
          case 'g':
            this.setFillColor('#A6E22E');
          break;
          case 'w':
            this.setFillColor('white');
          break;
        }
      } else {
        cursor += this.drawChar(text[t], offset[0]+cursor, offset[1]);
      }
    }

    if (cursor && drawCursor) {
      html5.context.fillRect(offset[0]+cursor, offset[1], fontHeight/2, fontHeight);
    }
  }

  this.draw = function () {
    if (this.elements.length == 0) {
      this.text ("\\wClique Aqui!");
    } else {
      for (var e=0;e<this.elements.length;e++) {
        var element = this.elements[e];
        element.draw();

        if (element.finished) {
          this.elements.splice(e, 1);
          e--;
        }
      }
    }
  }

  //@construct
  html5.context.font = "20px monospace";
  html5.context.textBaseline = "top";
}

// Initialize the canvas element used by the manifesto
function init_manifesto () {
    console.info ("Compiled Poetry Manifesto - Starting");

    html5.getCanvas2dContext();
    html5.loadAudio('audio/type.ogg', 'type');
    html5.loadAudio('audio/type2.ogg', 'type2');
    html5.loadAudio('audio/type3.ogg', 'type3');
    html5.loadAudio('audio/type4.ogg', 'type4');
    draw = new Draw();

    draw.setClearColor('#272822');
    draw.setFillColor('white');

    update_manifesto();
}

function create_scenes (list) {
  for (var l=0;l<list.length-1;l++) {
    var next = list[l+1];
    var here = list[l];

    here.onFinish = (function (next) {
      return function () {
        draw.elements.push(next);
      }
    })(next);
  }

  return list[0];
}

function begin_manifesto () {
  if (draw.elements.length > 0)
    return;

  var scene1 = create_scenes([
    new Typewrite("\\fMa|\\bni|\\cfes|\\dto| |\\eVersão| 0.1beta\\a|||||"),
    new Typewrite("\\aPoesia|:||| uma maneira de curar| a \\bangústia\\a| do poeta.|||"),
    new Typewrite("\\aCompilar|:||| Fazer a \\cconversão\\a| para \\gcódigo\\a| de máquina.|||"),
    new Typewrite("\\a\\cPoesia\\a|| \\eCompilada\\a||:||| \\d<|? !|>|||"),
    new Typewrite("\\a||||\\g#\\a ||./|manifesto||-poesia|-compilada|||"),
    new Typewrite("\\a||||\\bexecutamos|(\\c|poesia|\\a |<<| \\d|\"|programação\"\\a|\\b)\\a;||||"),
    new Typewrite("\\a|\\bcompilamos|(\\a|em \\f|Lugar\\b::\\fqualquer\\b|)\\a|;||||"),
    new Typewrite("\\a|\\g$não|\\a + \\d\"usamos\"|\\a |<< \\b|@uma\\a->\\b|(\\asó\\b)\\a| \\c|:|linguagem\\a;||||"),
    new Typewrite("\\a|\\binundamos|\\b(\\a|a \\cvida|\\a.\\bde_todos|\\b(|)|\\a com| \\cPOESIA_COMPILADA\\b|)\\a|;||||"),
    new Typewrite("\\a|\\g#\\a |||./|poesia |--loop|||||"),
    new Typewrite("\\a\\dNÓS\\a \\gFAZEMOS\\a|| \\cPOESIA\\a| \\eCOMPILADA\\b!||||||||"),
  ]);

  draw.elements.push(scene1);
}

// Draw the manifesto
function update_manifesto () {
  draw.clear();

  draw.draw();

  // Try to run at 30fps
  setTimeout(update_manifesto, 1000/30);
}

window.onload = function () {
  init_manifesto();
}
