function html5 () {
    // KEY CODES
    this.keyLeft  = 37;
    this.keyUp    = 38;
    this.keyRight = 39;
    this.keyDown  = 40;
    this.keySpace = 32;
    this.keyEnter = 13;
    this.keyA 	  = 65;
    this.keyS 	  = 83;
    this.keyD 	  = 68;
    this.keyW     = 87;
    this.keyE	  = 69;
    this.keyI	  = 73;
    this.keyC	  = 67;
    this.keyV	  = 86;
    this.keyX = 88;
    this.keyTilde = 192;
    this.keyESC	  = 27;
    this.keyCtrl  = 17;
    this.keyShift = 16;
    for (var i=0;i<10;i++)
	this["key"+i]	  = 48+i;

    // IF ANYONE KNOW OTHER WAY TO GET THEM, PLEASE TELL ME <felipe.oltavares@gmail.com>

    this.mouseWheel = 0;
    this.mousePos = [0,0];
    this.mouseButton = false;
    this.mouseButton2 = false;

    this.canvas = false;
    this.context = false;
    this.images = new Object();
    this.audios = new Object();

    this.keyboard = new Object();

    this.listenerUp = null;
    this.listenerDown = null;

    this.enabled = false;

    this.enableInput = function () {
    	this.enabled = true;
    	this.listenerDown = this.hitch(this.onDownEvent,this);
 	this.listenerUp = this.hitch(this.onUpEvent,this);
 	window.addEventListener('keydown',this.listenerDown,false);
	window.addEventListener('keyup',this.listenerUp,false);

	var k;
	for (k in this.keyboard) {
	    this.keyboard[k] = false;
	}
    }

    this.disableInput = function () {
    	this.enabled = false;
	var k;
	for (k in this.keyboard) {
	    this.keyboard[k] = false;
	}
 	window.removeEventListener('keydown',this.listenerDown,false);
	window.removeEventListener('keyup',this.listenerUp,false);
    }

    this.getCanvas2dContext = function () {
	this.canvas = document.getElementById("poem");
	if (this.canvas && this.canvas.getContext) {
	    this.context = this.canvas.getContext('2d');
	    this.canvas.addEventListener('mousemove', this.hitch (this.onMouseEvent,this), false);
	    window.addEventListener('mousedown', this.hitch (this.onMouseClick,this), false);
	    window.addEventListener('mouseup', this.hitch (this.onMouseRelease,this), false);
	    window.addEventListener('mousewheel', this.hitch (this.onMouseWheel,this), false);
	    window.addEventListener('touchmove', this.hitch (this.onMouseEvent,this), false);
	    window.addEventListener('touchstart', this.hitch (this.onMouseClick,this), false);
	    window.addEventListener('touchend', this.hitch (this.onMouseRelease,this), false);
	    this.canvas.addEventListener('contextmenu', this.hitch (this.preventEvent,this), false);
	    this.mousePos = [html5.canvas.width/2,html5.canvas.height/2]
	    return this.context;
	}
	else
	    return false;
    }

    this.hitch = function (func,newThis,args) { // Same idea of dojo.lang.hitch
	return function () {
	    func.apply(newThis,arguments);
	}
    }

    this.hitch2 = function (func,newThis,args) { // Same idea of dojo.lang.hitch
	return function () {
	    func.apply(newThis,args);
	}
    }

    this.loadImage = function (fname,name) {
	this.images[name] = new Image();
	this.images[name].src = fname+"?"+Math.random();
	this.images[name].onload = this.hitch (this.loadedImage,html5);
    }

    this.loadAudio = function (fname,name) {
	this.audios[name] = document.createElement('audio');
	this.audios[name].src = fname;
	this.audios[name].preload = true;
	//this.audios[name].addEventListener('canplaythrough', this.hitch (this.loadedImage,html5), false);
	this.audios[name].load();
    }

    this.image = function (name) {
	return this.images[name];
    }

    this.audio = function (name) {
	return this.audios[name];
    }

    this.onDownEvent = function (evt) {
    	if (this.enabled) {
	    //if (evt.keyCode != 122 &&
	    //	evt.keyCode != 116)
	    //	evt.preventDefault();
	    glb = evt;
	    this.keyboard[evt.keyCode] = true;

	    if (evt.keyCode == html5.keyESC) {
		if (paused == 2) {
		    paused = 1;
		    unpauseTime = tnow();
		}
		else
		    paused = 2;
	    }
      	}
    }

    this.onUpEvent = function (evt) {
    	if (this.enabled) {
	    evt.preventDefault();
	    this.keyboard[evt.keyCode] = false;
	}
    }

    this.get = function (url) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
	    xmlhttp=new XMLHttpRequest();
	}
	else {// code for IE6, IE5
	    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",url,false);
	xmlhttp.send();

	return xmlhttp.responseText;
    }

    this.onMouseEvent = function (evt) {
    	evt.preventDefault();
	this.mousePos = [evt.pageX-this.canvas.offsetLeft,evt.pageY-this.canvas.offsetTop];
    }

    this.preventEvent = function (evt) {
	evt.preventDefault();
	return false;
    }

    this.onMouseWheel = function (evt) {
	evt.preventDefault();
	this.mouseWheel = evt.wheelDelta;
	return false;
    }

    this.onMouseClick = function (evt) {
	//evt.preventDefault();

    	if (evt.button == 0)
    	    this.mouseButton = true;
	else
	    this.mouseButton2 = true;
	
	this.mousePos = [evt.pageX-this.canvas.offsetLeft,evt.pageY-this.canvas.offsetTop];
	
	return false;
    }

    this.onMouseRelease = function (evt) {
	//evt.preventDefault();

    	if (evt.button == 0)
    	    this.mouseButton = false;
	else
	    this.mouseButton2 = false;

	return false;
    }

    this.imgsLoaded = 0;
    this.loadingTextSize = 0;
    this.loadedImage = function () {
	html5.context.fillStyle = "white";
	html5.context.fillRect (0,0,html5.canvas.width,html5.canvas.height);

	this.imgsLoaded ++;
	var i,s=0;
	for (i in this.images) {s++;};
	//for (i in this.audios) {s++;};

	var msg = "Loading assets...";

	html5.context.font = "normal 40px serif";
	html5.context.fillStyle = "black";
	this.loadingTextSize = html5.context.measureText(msg).width;
	html5.context.fillText (msg,html5.canvas.width/2-html5.context.measureText(msg).width/2,html5.canvas.height/2);

	msg = "" + Math.floor((this.imgsLoaded/s*100)) + "%";
	msg += " "+this.imgsLoaded+"/"+s;

	html5.context.fillStyle = "gray";
	html5.context.fillRect (html5.canvas.width/2-this.loadingTextSize/2,html5.canvas.height/2+30,(this.loadingTextSize),5);
	html5.context.fillStyle = "black";
	html5.context.fillRect (html5.canvas.width/2-this.loadingTextSize/2,html5.canvas.height/2+30,this.imgsLoaded/s *(this.loadingTextSize),5);
	html5.context.font = "normal 20px serif";
	html5.context.fillText (msg,html5.canvas.width/2-html5.context.measureText(msg).width/2,html5.canvas.height/2+65);

	if (this.imgsLoaded == s) {
	    this.onLoad();
	}
    }

    this.onLoad = function () {
	alert ("Everything Loaded!");
    }

    this.loading = function () {
    }

    this.colorToRGBA = function (color) {
	var rgba = "";

	if (color[3] == undefined)
	    color[3] = 1;

	rgba += "rgba(";
	rgba += Math.floor(color[0]*255);
	rgba += ", ";
	rgba += Math.floor(color[1]*255);
	rgba += ", ";
	rgba += Math.floor(color[2]*255);
	rgba += ", ";
	rgba += Math.floor(color[3]*10)/10;
	rgba += ")";

	return rgba;
    }
}

html5 = new html5();
