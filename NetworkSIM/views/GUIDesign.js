
//gets the svg object from html
var i=0;
var svgCanvas = document.querySelector('svg'),
//gets SVG in order to display graphics
    svgNS = 'http://www.w3.org/2000/svg',
    //holds array of shapes in the svg
    shapes=[];
var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY 
}, false);

/**
 * ---------
 * Shape Classes
 * -------------------
 */

/**
 * Circle object to be rendered by SVG.
 * @param centerX: x value of the center of the circle
 * @param centerY: y  value of the center of the circle
 * @param radius: radius of the server
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the circle object to be created, used to attach CSS.
 */
function circle(centerX, centerY, radius, svgCanvas, elementClass){
	this.x=centerX;
	this.y=centerY;
	this.r=radius;
	this.stroke=1;
	
	//creates an SVG element in the DOM as a circle
	this.element = document.createElementNS(svgNS, 'circle');
	//set the unique id of this shape
	this.element.setAttribute('data-index', shapes.length);
	//sets the class of this shape to 
	this.element.setAttribute('class', elementClass);
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
	//orders the canvas so that devices are above networks
	orderCanvas();
}

function line(x1, y1, x2, y2, svgCanvas, elementClass){
	this.x1=x1;
	this.x2=x2;
	this.y1=y1;
	this.y2=y2;
	this.stroke=4
	
	this.element = document.createElementNS(svgNS, 'line');
	//set the unique id of this shape
	this.element.setAttribute('data-index', shapes.length);
	//sets the class of this shape to 
	this.element.setAttribute('class', elementClass);
	shapes.push(this);
	
	this.draw();
	//adds the line to the svg canvas
	svgCanvas.appendChild(this.element);
}

line.prototype.draw=function(){
	this.element.setAttribute('x1', this.x1);
	this.element.setAttribute('x2', this.x2);
	this.element.setAttribute('y1', this.y1);
	this.element.setAttribute('y2', this.y2);
	this.element.setAttribute('stroke-width', this.stroke);
	//orders the canvas so that devices are above networks
	orderCanvas();
}

/**
 * --------------
 * Shape Interaction
 * --------------------
 */

/**
 * Interaction with the "device" class
 */
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
			var circle = shapes[event.target.getAttribute('data-index')];
			//updates the location of the rectangle
			circle.x += event.dx;
			circle.y += event.dy;
			circle.draw();
		}
	})

/**
 * Interaction with the "network" class
 */
interact('.network')
	
	.dropzone({
		//only accept elements of the class device
		accept: '.device, .partition-create',
		
		overlap: 1.00,
		
		//if a droppable object is being held
		ondropactivate: function(event){
			//display where you can drop the object
			event.target.classList.add('drop-locations');
		},
		
		//if a droppable object is dragged within the network
		ondragenter: function (event) {
			//related target is the object  being dragged
		    var draggableElement = event.relatedTarget,
		        dropzoneElement = event.target;
		   
		    //if this is a device
		    if (draggableElement.classList.contains('device')){
			    // feedback the possibility of a drop
			    dropzoneElement.classList.add('drop-target');
			    draggableElement.classList.add('can-drop');
			    draggableElement.textContent = 'Dragged in';
		    }
		},
		//when an object leaves a droppable location
		ondragleave: function (event) {
			  // remove the indication of the object being able to be dropped
			  event.target.classList.remove('drop-target');
			  event.relatedTarget.classList.remove('can-drop');
		},
		//when an object is dropped into this network
		//this is where you would send messages to the server
		//telling it that a device has been added to a network
		
		ondrop: function (event) {
			var draggableElement = event.relatedTarget,
	        dropzoneElement = event.target;
			var draggableClass=draggableElement.getAttribute('class');
			var dropzoneClass=dropzoneElement.getAttribute('class');
			
			if(draggableClass==='partition-create'){
				var indexDifference=draggableElement.getAttribute('data-index')-dropzoneElement.getAttribute('data-index');
				if(indexDifference!=1){
					
					createPartition(dropzoneElement.getAttribute('cx'),dropzoneElement.getAttribute('cy'));
				}
			}
		
			
		    //createPartition(dropzoneElement.cx.baseVal.value, dropzoneElement.cy.baseVal.value);
			//put interaction in here
		},
		//when stopped holding a droppable object
		ondropdeactivate: function (event) {
			//remove css information
			event.target.classList.remove('drop-locations');
		    event.target.classList.remove('drop-target');
		},
	})
	//allows the network objects to drag out a partition
	/*.draggable({
		onstart: function(event){
			var x1=event.target.getAttribute('cx');
			var y1=event.target.getAttribute('cy');
			console.log(x1+","+y1);
			var pLine=new line(x1,y1,event.pageX,event.pageY,svgCanvas,'partition-line');
			pLine.draw();
		},
		onmove: function(event){
			var partitionLine=shapes.pop();
			partitionLine.x2=mouse.x;
			partitionLine.y2=mouse.y;
			partitionLine.draw();
			shapes.push(partitionLine);
		},
		onend: function(event){
			//if connected to new network create partition otherwise delete line
		}
	})
	.on('hold', function(event){
		var network = shapes[event.target.getAttribute('data-index')];
		new circle(event.x, event.y, 5, svgCanvas, 'partition-create');
	})*/

	
/******
 * HERE'S THE PLAN
 * Each network is initialized with a partition node in the center. You can drag that node to other networks to create a partition. You can probably click the line
 * that will be made to delete it or something but we can sort that out later.
 *******/
interact('.partition-create')
	.draggable({
		// enable inertial throwing
	    inertia: true,
	    
	    //restricts the object to stay within the parent object
	    restrict: {
	        restriction: "parent",
	        endOnly: true,
	        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	    },
	    onstart: function(event){
	    	//the idea here is to save the original coordinates
			origin.x=mouse.x;
			origin.y=mouse.y;
			console.log(origin.x+","+origin.y);
		},
		//handles moving the circle
		onmove: function (event) {
		//gets the circle from the list of shapes
			var circle = shapes[event.target.getAttribute('data-index')];
			//updates the location of the rectangle
			circle.x += event.dx;
			circle.y += event.dy;
			circle.draw();
		},
		onend: function(event){
			
		}
	});

	
/**
 * --------
 * Utilities and Button Handlers
 * -----------------
 */

/**
 * orderCanvas orders all the shapes on the canvas so that devices
 * appear infront of networks.
 */
function orderCanvas(){
	for (var i = 0; i < shapes.length; i++){
		if (shapes[i].element.getAttribute('class')=='device'){
			svgCanvas.appendChild(shapes[i].element);
		}
	}
}

//creates a network circle
function createNetwork(){
	new circle(100+300*i, 500, 100, svgCanvas, 'network');
	new circle(100+300*i,500,5, svgCanvas,'partition-create');
	i+=1;
}

//creates a device circle
function createDevice(){
	new circle(50, 50, 10, svgCanvas, 'device');
}

function createPartition(destinationx, destinationy){
	console.log("("+destinationx+","+destinationy+")("+origin.x+","+origin.y+")");
	new line(destinationx,destinationy,origin.x, origin.y,svgCanvas,'partition-line');
}