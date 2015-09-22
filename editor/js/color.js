String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function ColorNode (color, data) {
    this.color = color;
    this.next = null;
    this.prev = null;
    this.data = data;

    this.html = function () {
	return '<span style="color: '+this.color+'">'+this.data+'</span>';
    }

    this.del = function (s, e, poetry) {
	console.log ("del("+s+","+e+") from "+this.data);
	
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

    this.insert = function (p, w, poetry) {
	console.log ("insert at "+p+" of "+w+" in block "+this.data);

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
	} else if (p == this.lenght()) {
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

    this.lenght = function () {
	return this.data.length;
    }
}

function CompiledPoetry () {
    this.head = null;
    this.tail = null;
    this.color = "white";

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
	    nsp += n.lenght();
	    i = n;
	    n = n.next;

	    console.log (sp, nsp);

	    if (sp <= p && !(nsp <= p))
		break;
	} while (n);

	i.insert (p-sp, w, this);
    }

    this.popAt = function (s, e) {
	var n = this.tail;
	var i = n;
	// Block start position, next block start position
	var sp = 0, nsp = 0;
	do {
	    sp = nsp;
	    nsp += n.lenght();
	    i = n;
	    n = n.next;

	    console.log (sp, nsp);

	    if (sp <= s && !(nsp <= s))
		break;
	} while (n);

	// del starts at chunk i
	i.del(s-sp, this.ending(sp, nsp, e), this);

	do {
	    if (n) {
		sp = nsp;
		nsp += n.lenght();
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

    this.render = function () {
	var n = this.tail;
	var html = "";
	while (n) {
	    html += n.html();
	    n = n.next;
	}
	return html;
    }
}
