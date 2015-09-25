var comp = new CompiledPoetry();

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

comp.importFromUrl(getUrlData());

$("#poem").html(comp.render());
