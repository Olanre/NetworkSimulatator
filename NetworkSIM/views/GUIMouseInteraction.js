/**
 * Handles all of the non-interact JS mouse interaction
 * including right click and mouse over. 
 * 
 * NOTE: don't know what folder this should be in
 */

/****
 * handles getting what the mouse has moved over 
 ****/
function mouseOver(e){
	e = e || event;
	if (event.type == 'mouseover'){
		var fromElem = e.fromElement || e.relatedTarget;
		var toElem = e.srcElement || e.target;
	}
	else if (e.type == 'mouseout'){
		fromElem = e.srcElement || e.target;
		toElem = e.toElement || e.relatedTarget;
	}
	function str(el) { return el ? (el.id || el.nodeName) : 'null' }
	//alert("From "+str(fromElem)+ " to "+str(toElem));
}
document.body.onmouseover = document.body.onmouseout = mouseOver;

