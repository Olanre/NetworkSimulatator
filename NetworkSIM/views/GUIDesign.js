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
function circle(centerX, centerY, radius, svgCanvas){
	this.x=centerX;
	this.y=centerY;
	this.r=radius;
	this.stroke=1;
	
	//creates an SVG element in the DOM as a circle
	this.element = document.createElementNS(svgNS, 'circle');
	//set the unique id of this shape
	this.element.setAttribute('data-index', shapes.length);
	//sets the class of this shape to 
	this.element.setAttribute('class', 'device');
	shapes.push(this);
	
	this.draw();
	//adds the circle to the svg canvas
	svgCanvas.appendChild(this.element);
}

circle.prototype.draw=function(){
	//should it have something to do with stroke?
	this.element.setAttribute('cx', this.x); 
	this.element.setAttribute('cy', this.y);
	this.element.setAttribute('r', this.r);
	this.element.setAttribute('stroke', this.stroke);
}

//listener for the events for the ".network" class
interact('.device')
//handles a dragging event for the circle
	.draggable({
		// enable inertial throwing
	    inertia: true,
	    
	    //restricts the object to stay within the parent object
	    restrict: {
	        restriction: "parent",
	        endOnly: true,
	        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	      },
	      
		//handles moving the circle
		onmove: function (event) {
		//gets the circle from the list of shapes
			var rectangle = shapes[event.target.getAttribute('data-index')];
			//updates the location of the rectangle
			rectangle.x += event.dx;
			rectangle.y += event.dy;
			rectangle.draw();
		}
})

for (var i = 0; i < 5; i++) {
  new circle(100 + 200*i, 80+i*30, 20, svgCanvas);
}