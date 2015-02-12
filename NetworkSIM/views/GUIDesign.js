//gets the svg object from html
var svgCanvas = document.querySelector('svg'),
//gets SVG in order to display graphics
    svgNS = 'http://www.w3.org/2000/svg',
    //holds array of shapes in the svg
    shapes=[];
/**
 * Circle object to be rendered by SVG.
 * @param centerX: x value of the center of the circle
 * @param centerY: y  value of the center of the circle
 * @param radius: radius of the server
 * @param svgCanvas: the canvas to paint this object on
 */
function circle(centerX, centerY, radius, svgCanvas, circleClass){
	this.x=centerX;
	this.y=centerY;
	this.r=radius;
	this.stroke=2;
	
	//creates an SVG element in the DOM as a circle
	this.element = document.createElementNS(svgNS, 'circle');
	//sets the class of this shape to 
	this.el.setAttribute('class', circleClass);
	shapes.push(this;)
}

