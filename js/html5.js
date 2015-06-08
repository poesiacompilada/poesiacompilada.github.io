function html5 () {
    // KEY CODES
    this.keyLeft  = 37;
    this.keyUp    = 38;
    this.keyRight = 39;
    this.keyDown  = 40;
    this.keySpace = 32;
    this.keyW     = 87;
    // IF ANYONE KNOW OTHER WAY TO GET THEM, PLEASE TELL ME <felipe.oltavares@gmail.com>


    this.canvas = false;
    this.context = false;
    this.images = new Object();
    this.audios = new Object();

    this.keyboard = new Object();

    this.getCanvas2dContext = function () {
	this.canvas = document.getElementById("html_canvas");
	if (this.canvas && this.canvas.getContext) {
	    this.context = this.canvas.getContext('2d');
	    window.addEventListener('keydown',this.hitch(this.onDownEvent,this),true);
	    window.addEventListener('keyup',this.hitch(this.onUpEvent,this),true);
	    return this.context;
	}   
	else
	    return false;
    }

    this.hitch = function (func,newThis) { // Same idea of dojo.lang.hitch
	return function () {
	    func.apply(newThis,arguments);
	}
    }

    this.loadImage = function (fname,name) {
	this.images[name] = new Image();
	this.images[name].src = fname;
    }

    this.loadAudio = function (fname,name) {
	this.audios[name] = document.createElement('audio');
	this.audios[name].setAttribute('controls','false');
	this.audios[name].setAttribute('src', fname);
	this.audios[name].load();
    }

    this.image = function (name) {
	return this.images[name];
    }

    this.audio = function (name) {
	return this.audios[name];
    }

    this.onDownEvent = function (evt) {
	this.keyboard[evt.keyCode] = true;
    }

    this.onUpEvent = function (evt) {
	this.keyboard[evt.keyCode] = false;
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
}

html5 = new html5();