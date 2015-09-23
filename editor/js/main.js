$("#color").keyup(function (evt) {
    if (evt.keyCode == 13)
	colorize();
});

var editor = CodeMirror(document.getElementById("editor"), {
    lineNumbers: true,
    theme: "monokai"
});

editor.addKeyMap(CodeMirror.normalizeKeyMap({
    "Alt-C": function(cm) {openEd();}
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
    // console.log (ch, toLinear(ch.from), toLinear(ch.to));

    if (ch.origin == "+input" || ch.origin == "*compose") {
	if (toLinear(ch.from)-toLinear(ch.to) == 0)
	    comp.pushAt(toLinear(ch.from), concat(ch.text));
	else {
	    comp.popAt(toLinear(ch.from), toLinear(ch.to));
	    comp.pushAt(toLinear(ch.from), concat(ch.text));
	}
    } else if (ch.origin == "+delete") {
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

    html += '<div class="button" title="" onclick="comp.setColor(\''+color+'\')"><div style="background: '+color+';width: 60px;height: 60px; border-radius: 10px;"></div>';

    $("#sidebar").append($(html));
}

function encodeURIComplete(str) {
    return encodeURIComponent(btoa(str)).replace(/!/g, '%21');
}

function setUrlData (data) {
    data = encodeURIComplete(data);
    window.history.replaceState("", "PEd", window.location.pathname+"?v="+data);
}

function getUrlData () {
    var urlSize = (window.location.protocol+"//"+window.location.hostname+window.location.pathname).length;
    var dataUrl = window.location.href.substr(urlSize, window.location.href.length-urlSize);

    if (dataUrl.substr(0,3) == '?v=')
	return atob(decodeURIComponent(dataUrl.substr(3, dataUrl.length-3)));
    else
	return atob(decideURIComponent(dataUrl));
}

addColorButton("#66D9EF");
addColorButton("#F92672");
addColorButton("#524f52");
addColorButton("#E6DB74");
addColorButton("#75715E");
addColorButton("#AE81FF");
addColorButton("#A6E22E");

editor.setSize("100%", "100%");

comp.importFromUrl(getUrlData());
