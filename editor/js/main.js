$("#color").keyup(function (evt) {
    if (evt.keyCode == 13)
	colorize();
});

var editor = CodeMirror(document.getElementById("editor"), {
    lineNumbers: true,
    theme: "monokai"
});

function getUrl () {
    if (window.location.pathname.indexOf('index.html') > -1)
	return window.location.protocol+"//"+window.location.hostname+window.location.pathname.replace('index.html', 'view.html');
    else if (window.location.pathname.indexOf('?') > -1)
	return window.location.protocol+"//"+window.location.hostname+window.location.pathname.replace('?', 'view.html?');
    else
	return window.location.protocol+"//"+window.location.hostname+window.location.pathname;
}

editor.addKeyMap(CodeMirror.normalizeKeyMap({
    "Alt-C": function(cm) {openEd();},
    "Alt-H": function(cm) {window.prompt("Pressione: Ctrl+C, Enter", comp.render())},
    "Alt-U": function(cm) {window.prompt("Pressione: Ctrl-C, Enter", getUrl()+"?v="+encodeURIComplete(comp.exportToUrl()))}
}));

var comp = new CompiledPoetry();

function closeEd () {
    $("#dialog").fadeOut(300);
    $("#color").val("");
    editor.focus();
}

function openEd () {
    $("#dialog").fadeIn(300);
    $("#color").focus();
}

function toLinear (cartesian) {
    var content = editor.getValue();
    var p = 0;
    var x = 0, y = 0;

    while (true) {
	if (x >= cartesian.ch && y >= cartesian.line) {
	    break;
	}

	if (content[p] == '\n') {
	    y++;
	    x=0;
	    p++;
	} else {
	    x++;
	    p++;
	}
    }

    return p;
}

function concat (lines) {
    var r = "";
    for (var l in lines) {
	if (l > 0)
	    r += "\n";
	r += lines[l];
    }
    return r;
}

editor.on("beforeChange", function (instance, ch) {
    console.log (ch, toLinear(ch.from), toLinear(ch.to));

    if (ch.origin == "+input" || ch.origin == "*compose" || ch.origin == "paste" || ch.origin == "undo" || ch.origin == "redo") {
	if (toLinear(ch.from)-toLinear(ch.to) == 0)
	    comp.pushAt(toLinear(ch.from), concat(ch.text));
	else {
	    comp.popAt(toLinear(ch.from), toLinear(ch.to));
	    comp.pushAt(toLinear(ch.from), concat(ch.text));
	}
    } else if (ch.origin == "+delete" || ch.origin == "cut") {
	comp.popAt(toLinear(ch.from), toLinear(ch.to));
    }

    comp.forEach(function (node) {
	//console.log ("ColorNode("+node.color+") = '"+node.data+"'");
    });

    comp.renderOnCanvas(true);

    //$("#poem").html(comp.render());
});

function colorize () {
    comp.setColor($("#color").val());
    closeEd();
}

function addColorButton (color) {
    var html = "";

    html += '<div class="button" title="Utilizar cor '+color+'" onclick="comp.setColor(\''+color+'\')"><div style="background: '+color+';width: 60px;height: 60px; border-radius: 10px;"></div>';

    $("#sidebar").append($(html));
}

function encodeURIComplete(str) {
    return encodeURIComponent(btoa(str));
}

function setUrlData (data) {
    data = encodeURIComplete(data);
   
    if (data)
	window.history.replaceState("", "Poesia()", window.location.pathname+"?v="+data);
    else
	window.history.replaceState("", "Poesia()", window.location.pathname);
}

function getUrlData () {
    var urlSize = (window.location.protocol+"//"+window.location.hostname+window.location.pathname).length;
    var dataUrl = window.location.href.substr(urlSize, window.location.href.length-urlSize);

    if (dataUrl.substr(0,3) == '?v=')
	return atob(decodeURIComponent(dataUrl.substr(3, dataUrl.length-3)));
    else
	return atob(decodeURIComponent(dataUrl));
}


// Monokai's colors
addColorButton("#66D9EF");
addColorButton("#F92672");
addColorButton("#524f52");
addColorButton("#E6DB74");
addColorButton("#75715E");
addColorButton("#AE81FF");
addColorButton("#A6E22E");

editor.setSize("100%", "100%");

comp.importFromUrl(getUrlData());
