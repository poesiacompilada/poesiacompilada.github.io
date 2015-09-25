String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function ColorNode (color, data) {
    this.color = color;
    this.next = null;
    this.prev = null;
    this.data = data;

    this.html = function () {
	return '<span style="color: '+this.color+'">'+this.data.replace(/\n/g, '<br>')+'</span>';
    }

    this.del = function (s, e, poetry) {
	//console.log ("del("+s+","+e+") from "+this.data);
	
	this.data = this.data.substr(0, s)+this.data.substr(e, this.data.length-e);

	if (this.data == "") {
	    if (this.prev)
		this.prev.next = this.next;
	    else
		poetry.updateTail(this, this.next);

	    if (this.next)
		this.next.prev = this.prev;
	    else
		poetry.updateHead(this, this.prev);
	}
    }

    this.change = function (s, e, poetry, ncolor) {
	//console.log ("change("+s+","+e+","+ncolor+") from "+this.data);
	
	if (s == 0 && e == this.data.length) {
	    this.color = ncolor;
	    return;
	}

	if (s > 0) {
	    var newMe = new ColorNode(this.color, this.data.substr(0, s));
	    
	    newMe.prev = this.prev;
	    newMe.next = this;
	    
	    if (this.prev) {
		this.prev.next = newMe;
	    } else
		poetry.updateTail(this, newMe);

	    this.prev = newMe;
	}

	if (e < this.data.length) {
	    var newMe = new ColorNode(this.color, this.data.substr(e, this.data.length-e));
	    newMe.prev = this;
	    newMe.next = this.next;

	    if (this.next) {
		this.next.prev = newMe;
	    } else
		poetry.updateHead(this, newMe);
	    
	    this.next = newMe;
	}

	this.data = this.data.substr(s, e-s);
	this.color = ncolor;
    }

    this.insert = function (p, w, poetry) {
	//console.log ("insert at "+p+" of "+w+" in block "+this.data);

	if (poetry.color == this.color) {
	    this.data = this.data.splice (p, 0, w);
	    return;
	}

	if (p == 0) {
	    var n = new ColorNode(poetry.color, w);
	    n.prev = this.prev;
	    n.next = this;
	    if (this.prev) {
		this.prev.next = n;
	    } else
		poetry.updateTail(this, n);
	    this.prev = n;
	} else if (p == this.length()) {
	    var n = new ColorNode(poetry.color, w);
	    n.prev = this;
	    n.next = this.next;
	    if (this.next) {
		this.next.prev = n;
	    } else 
		poetry.updateHead(this, n);
	    this.next = n;
	} else {
	    var newMe = new ColorNode(this.color, this.data.substr(0, p));
	    this.data = this.data.substr (p, (this.data.length-p));
	    
	    newMe.prev = this.prev;
	    newMe.next = this;
	    this.prev.next = newMe;
	    this.prev = newMe;
	    
	    poetry.updateTail(this, newMe);

	    this.insert (0, w, poetry);
	}
    }

    this.length = function () {
	return this.data.length;
    }
}

function CompiledPoetry () {
    this.head = null;
    this.tail = null;
    this.color = "white";
    this.font = 16;

    this.changeFontSize = function (delta) {
	var newFontSize = this.font + delta;

	if (newFontSize > 0) {
	    this.font = newFontSize;
	    this.renderOnCanvas(true);
	}
    }
    
    this.updateTail = function (current, n) {
	if (this.tail == current)
	    this.tail = n;
    }

    this.updateHead = function (current, n) {
	if (this.head == current)
	    this.head = n;
    }

    this.pushFront = function (node) {
	if (this.head == null) {
	    this.head = node;
	    this.tail = node;
	} else {
	    this.head.next = node;
	    node.prev = this.head;
	    this.head = node;
	}
    }

    this.pushBack = function (node) {
	if (this.tail == null) {
	    this.head = node;
	    this.tail = node;
	} else {
	    this.tail.prev = node;
	    node.next = this.tail;
	    this.tail = node;
	}
    }

    this.setColor = function (c) {
	this.color = c;
	var selections = editor.listSelections();

	if (selections.length > 0) {
	    for (var s in selections) {
		var start = toLinear(selections[s].head);
		var end = toLinear(selections[s].anchor);

		if (start > end) {
		    var buf = start;
		    start = end;
		    end = buf;
		}

		if (start-end != 0)
		    this.changeAt(start, end, this.color);
	    }
	}

	editor.focus();
    }

    // A detailded description of the algorithm used can be found
    // in the ideas.org file.
    this.pushAt = function (p, w) {
	if (w == "")
	    return;

	var n = this.tail;
	var i = n;
	// Block start position, next block start position
	var sp = 0, nsp = 0;

	if (!i) {
	    this.pushFront(new ColorNode(this.color, w));
	    return;
	}

	do {
	    sp = nsp;
	    nsp += n.length();
	    i = n;
	    n = n.next;

	    //console.log (sp, nsp);

	    if (sp <= p && !(nsp <= p))
		break;
	} while (n);

	i.insert (p-sp, w, this);
    }

    this.changeAt = function (s, e, c) {
	var n = this.tail;
	var i = n;

	if (!n)
	    return;

	// Block start position, next block start position
	var sp = 0, nsp = 0;
	do {
	    sp = nsp;
	    nsp += n.length();
	    i = n;
	    n = n.next;

	    //console.log (sp, nsp);

	    if (sp <= s && !(nsp <= s))
		break;
	} while (n);

	i.change(s-sp, this.ending(sp, nsp, e), this, c);

	do {
	    if (n) {
		sp = nsp;
		nsp += n.length();
		i = n;
		n = n.next;
		
		if (i) {
		    if (sp <= e)
			i.change(0, this.ending(sp, nsp, e), this, c);
		    else
			break;
		}
	    }
	} while (n);

	this.renderOnCanvas();
    }

    this.popAt = function (s, e) {
	var n = this.tail;
	var i = n;
	// Block start position, next block start position
	var sp = 0, nsp = 0;

	if (!n)
	    return;

	do {
	    sp = nsp;
	    nsp += n.length();
	    i = n;
	    n = n.next;

	    //console.log (sp, nsp);

	    if (sp <= s && !(nsp <= s))
		break;
	} while (n);

	// del starts at chunk i
	i.del(s-sp, this.ending(sp, nsp, e), this);

	do {
	    if (n) {
		sp = nsp;
		nsp += n.length();
		i = n;
		n = n.next;
		
		if (i) {
		    if (sp <= e)
			i.del(0, this.ending(sp, nsp, e), this);
		    else
			break;
		}
	    }
	} while (n);
    }

    this.ending = function (cs, ce, e) {
	var v = e-cs;

	if (v > ce-cs)
	    return ce-cs;
	else
	    return v;
    }

    this.forEach = function (fn) {
	var n = this.tail;
	while (n) {
	    fn(n);
	    n = n.next;
	}
    }

    this.merge = function () {
	var n = this.tail;
	while (n) {
	    if (n.next) {
		if (n.color == n.next.color) {
		    n.data += n.next.data;
		    if (n.next.next) {
			n.next.next.prev = n;
		    }
		    n.next = n.next.next;
		}
	    }
	    n = n.next;
	}
    }

    this.render = function () {
	var n = this.tail;
	var html = "";
	while (n) {
	    html += n.html();
	    n = n.next;
	}
	return html;
    }
    
    // Render over a canvas insetead of returning an HTML
    // rendering
    this.renderOnCanvas = function (zero) {
	this.merge();

	var margin = 6;
	var font = this.font;

	if (zero) {
	    html5.canvas.width = margin*2;
	    html5.canvas.height = margin*2+font;
	}

	this.clearCanvas();

	//console.log ("Target buffer is ("+html5.canvas.width+","+html5.canvas.height+")");
	
	var n = this.tail;
	var p = [margin, margin];

	html5.context.textBaseline = "top";
	html5.context.textAlign = "left";
	html5.context.font = font+"px monospace";
	
	while (n) {
	    //console.log ("Filling with "+n.color+": "+n.data);

	    var lines = this.textToLines(n.data);

	    for (l in lines) {
		html5.context.fillStyle = n.color;
		html5.context.fillText (lines[l][0], p[0], p[1]);

		p[0] += html5.context.measureText(lines[l][0]).width;

		if (p[0] > html5.canvas.width) {
		    html5.canvas.width = p[0]+margin;
		    this.renderOnCanvas();
		    return;
		}

		if (lines[l][1]) {
		    p[0] = margin;
		    p[1] += font;

		    if (p[1]+font+margin > html5.canvas.height) {
			html5.canvas.height = p[1]+font+margin;
			this.renderOnCanvas();
			return;
		    }
		}
	    }

	    n = n.next;
	}

	// Center the canvas
	this.centerCanvas();
	setUrlData(this.exportToUrl());
    }

    this.centerCanvas = function () {
	// Get sizes
	var w = $(window).width();
	var h = $(window).height();
	var cw = html5.canvas.width;
	var ch = html5.canvas.height;

	if (cw >= w/2)
	    $("#poem").css("left", "0");
	else
	    $("#poem").css("left", ((w/2-cw)/2)+"px");
	
	if (ch >= h)
	    $("#poem").css("top", "0");
	else
	    $("#poem").css("top", ((h-ch)/2)+"px");
    }

    this.textToLines = function (text) {
	var lines = [];
	lines.push(["", false]);

	for (var c=0;c<text.length;c++) {
	    if (text[c] == '\n') {
		lines[lines.length-1][1] = true;
		lines.push(["", false]);
	    } else {
		lines[lines.length-1][0] += text[c];
	    }
	}

	return lines;
    }

    this.importFromUrl = function (data) {
	this.tail = this.head = null;

	var p = 0, e;
	var editorValue = "";

	while (p < data.length) {
	    var color = "";
	    var len = "";
	    var content = "";
	    while (data[p++] != ';') {
		color += data[p-1];

		if (p > data.length)
		    return;
	    }
	    while (data[p++] != ';') {
		len += data[p-1];

		if (p > data.length)
		    return;
	    }
	    len = Math.floor(len);
	    e = p+len;
	    while (p < e) {
		content += data[p++];

		if (p > data.length)
		    return;
	    }

	    editorValue += content;
	    this.pushFront(new ColorNode(color, content));
	}

	if (typeof editor !== 'undefined') {
	    editor.setValue(editorValue);
	    this.renderOnCanvas();
	}
    }

    this.exportToUrl = function () {
	var n = this.tail;
	var url = "";
	while (n) {
	    url += n.color+";"+n.length()+";"+n.data;
	    n = n.next;
	}
	return url;	
    }

    this.exportToWindow = function () {
	var w = html5.canvas.width;
	var h = html5.canvas.height;

	if (w > 800)
	    w = 800;
	if (h > 600)
	    h = 600;

	window.open(html5.canvas.toDataURL("image/png"), "PEd Export", "width="+w+",height="+h);
    }

    this.clearCanvas = function () {
	// html5.context.clearRect(0,0,html5.canvas.width,html5.canvas.height);
	html5.context.fillStyle = "#272822";
	html5.context.fillRect(0,0,html5.canvas.width,html5.canvas.height);
    }
}

html5.getCanvas2dContext();
html5.enableInput();
