/**
 * loads a CSS stylesheet onto the page
 */
function loadStyleSheet(src){
    if (document.createStyleSheet) document.createStyleSheet(src);
    else {
        var stylesheet = document.createElement('link');
        stylesheet.href = src;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
}
function loadJSFile(path){
	 var fileref=document.createElement('script');
     fileref.setAttribute("type","text/javascript");
     fileref.setAttribute("src", path);
     document.getElementsByTagName("head")[0].appendChild(fileref)
}
