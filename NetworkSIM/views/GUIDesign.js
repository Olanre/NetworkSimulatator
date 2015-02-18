var i=0;
var svgCanvas = document.querySelector('svg'),

//gets SVG in order to display graphics
    svgNS = 'http://www.w3.org/2000/svg',
    shapes=[];
var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY 
}, false);


/****
 * -------------------
 * Shape Classes
 * -------------------
 ****/

/****
 * Circle object to be rendered by SVG.
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the circle object to be created, used to attach CSS.
 ****/
function circle(centerX, centerY, radius, svgCanvas, elementClass){
	this.x=centerX;
	this.y=centerY;
	this.r=radius;
	this.stroke=1;
	
	//creates an SVG element in the DOM as a circle
	this.element = document.createElementNS(svgNS, 'circle');
	//set the unique id of this shape
	this.element.setAttribute('data-index', shapes.length);
	this.element.setAttribute('class', elementClass);
	this.children=[];
	this.connections=[];
	this.draw();
	//adds the circle to the svg canvas
	svgCanvas.appendChild(this.element);
}

circle.prototype.draw=function(){
	this.element.setAttribute('cx', this.x); 
	this.element.setAttribute('cy', this.y);
	this.element.setAttribute('r', this.r);
	this.element.setAttribute('stroke', this.stroke);
	//orders the canvas so that devices are above networks
	orderCanvas();
}

/****
 * Line object to be rendered by SVG.
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the line object to be created, used to attach CSS.
 ****/
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
	orderCanvas();
}

line.prototype.update=function(newx,newy){
	if((Math.abs(this.x1-newx)+Math.abs(this.y1-newy))<(Math.abs(this.x2-newx)+Math.abs(this.y2-newy))){
		this.x1=newx;
		this.y1=newy;
	}
	else{
		this.x2=newx;
		this.y2=newy;
	}
	
	
}
/****
 * --------------
 * Object Interactions
 * --------------------
 ****/

/****
 * Interaction with the "device" class
 ****/
interact('.device')

	.draggable({
		
	    inertia: true,
	    
	    restrict: {
	        restriction: 'parent',
	    },

		onmove: function (event) {
		
		//gets the circle from the list of shapes
			var circle = getShapeFromEvent(event);
			
			//updates the location
			circle.x += event.dx;
			circle.y += event.dy;
			circle.draw();
		}
	});

/****
 * Interaction with the "network" class
 ****/
interact('.network')
	
	.dropzone({
		
		accept: '.device, .network',
		
		overlap: 0.85,
		
		//if a droppable object is being held
		ondropactivate: function(event){
			//display where you can drop the object
			event.target.classList.add('drop-locations');
		},
		
		//if a droppable object is dragged within
		ondragenter: function (event) {
			//related target is the object  being dragged
		    var draggableElement = event.relatedTarget,
		        dropzoneElement = event.target;
		   
		    
		    if (draggableElement.classList.contains('device')){
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
			  var network=getShapeFromEvent(event);
			  var networkIndex=event.target.getAttribute('data-index');
			  var device=getRelatedShapeFromEvent(event);
			  var deviceIndex=event.relatedTarget.getAttribute('data-index');
			  delete network.children[deviceIndex];
			  shapes[networkIndex]=network;
			  
		},

		
		ondrop: function (event) {
			var draggableElement = event.relatedTarget;
	        var dropzoneElement = event.target;
			var dragClass=draggableElement.classList[0];
			
			var dropzone=getShapeFromEvent(event);
			var dragged=getRelatedShapeFromEvent(event);
			
			if(dragClass==='device'){
				var deviceIndex=draggableElement.getAttribute('data-index');
				var networkIndex=dropzoneElement.getAttribute('data-index');
				dropzone.children[deviceIndex]=(dragged);
				shapes[networkIndex]=dropzone;
			}
			if(dragClass==='network'){
				
				
				if(isValidPartition(dropzone,dragged)){
					var partition=createPartition(dropzone,dragged);
				}
				var networkIndex=draggableElement.getAttribute('data-index');
				var heldCircle=shapes[networkIndex];
				snapToLocation(heldCircle,origin);
			}
		
		},
		//when no longer holding a droppable object,
		ondropdeactivate: function (event) {
			//remove css information
			event.target.classList.remove('drop-locations');
		    event.target.classList.remove('drop-target');
		},
	})
	
	.draggable({
			
		    inertia: true,
		    
		    restrict: {
		        restriction: 'parent',
		    },
		
			onmove: function (event) {
				
				var circle = shapes[event.target.getAttribute('data-index')];
				circle.x += event.dx;
				circle.y += event.dy;
				for(index in circle.children){
					circle.children[index].x+=event.dx;
					circle.children[index].y+=event.dy;
					circle.children[index].draw();
				}
				for(index in circle.connections){
					var lineIndex=circle.connections[index];
					var line=shapes[lineIndex];
					line.update(circle.x,circle.y);
					line.draw();
				}
				circle.draw();
			},
			
			onstart: function(event){
		    	
		    	var circle = shapes[event.target.getAttribute('data-index')];
				origin.x=circle.x;
				origin.y=circle.y;
				
			},

		
			
		});
	
/**
 * --------
 * Utilities and Button Handlers
 * -----------------
 */

function snapToLocation(shape,coordinates){
	for(index in shape.children){
		var child=shape.children[index];
		child.x-=(shape.x-coordinates.x);
		child.y-=(shape.y-coordinates.y);
		child.draw();
		
	}
	for(index in shape.connections){
		var lineIndex=shape.connections[index];
		var line=shapes[lineIndex];
		line.update(coordinates.x,coordinates.y);
		line.draw();
	}
	shape.x=coordinates.x;
	shape.y=coordinates.y;
	shape.draw();
}
/****
* We'll update this later so that it actually checks if the partition doesn't already exist.
 ****/
function isValidPartition(dropzoneObject, dragObject){
	return true;
}

function getShapeFromEvent(event){
	var index=event.target.getAttribute('data-index');
	return shapes[index];
}
function getRelatedShapeFromEvent(event){
	var index=event.relatedTarget.getAttribute('data-index');
	return shapes[index];
}
/****
 * orderCanvas orders all the shapes on the canvas so that devices
 * appear in front of networks.
 ****/
function orderCanvas(){
	for (var i = 0; i < shapes.length; i++){
		if (shapes[i].element.getAttribute('class')!='network-connection'){
			svgCanvas.appendChild(shapes[i].element);
		}
	}
	for (var i = 0; i < shapes.length; i++){
		if (shapes[i].element.getAttribute('class')=='device'){
			svgCanvas.appendChild(shapes[i].element);
		}
	}
}


function createNetwork(){
	var  network=new circle(100, 500, 100, svgCanvas, 'network');
	shapes.push(network);
	i+=1;
}


function createDevice(){
	var device=new circle(50, 50, 10, svgCanvas, 'device');
	shapes.push(device);
}

function createPartition(sourceNetwork, destinationNetwork){
	var connection=new line(origin.x,origin.y,destinationNetwork.x, destinationNetwork.y,svgCanvas,'network-connection');

	var index=shapes.length;
	shapes.push(connection);
	sourceNetwork.connections.push(index);
	destinationNetwork.connections.push(index);
}