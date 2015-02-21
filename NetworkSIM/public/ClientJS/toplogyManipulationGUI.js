// We are using uniqueDataIndex to track shapes. It only ever increases.
 
var uniqueDataIndex=0;
var svgCanvas = document.querySelector('svg'),

//svg is required for the graphics
    svgNS = 'http://www.w3.org/2000/svg',
    shapes=[];

var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};



/****
 * The main functions used in our GUI
 ***/
function createNetworkGraphic(){
	var  network=new circle(100, 500, 80, svgCanvas, 'network');
	shapes[uniqueDataIndex]=(network);
	uniqueDataIndex++;
}


function createDeviceGraphic(){
	var device=new circle(50, 50, 10, svgCanvas, 'device');
	shapes[uniqueDataIndex]=(device);
	uniqueDataIndex++;
}

function createPartitionGraphic(sourceNetwork, destinationNetwork){
	var connection=new line(origin.x,origin.y,destinationNetwork.x, destinationNetwork.y,svgCanvas,'network-connection');
	shapes[uniqueDataIndex]=(connection);
	sourceNetwork.connections[uniqueDataIndex]=destinationNetwork;
	destinationNetwork.connections[uniqueDataIndex]=sourceNetwork;
	uniqueDataIndex++;
}
function removePartition(sourceNetwork,destinationNetwork){
	var index=sourceNetwork.connections.indexOf(destinationNetwork);
	delete destinationNetwork.connections[index];
	delete sourceNetwork.connections[index];
	var oldLine=shapes[index];
	svgCanvas.removeChild(oldLine.element);
	delete shapes[index];
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
	    
	  //restricts the device to be inside the canvas
	    restrict:{
	        restriction: "parent",
	        endOnly: true,
	        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	    },
	    
	    onstart: function(event){
			//adds class to make sure object you are moving is on top 
			var circle = getShapeFromEvent(event);
			circle.element.classList.add('held-object');
		},

		onmove: function (event) {
		
		//gets the circle from the list of shapes
			var circle = getShapeFromEvent(event);
			moveUIElementAndChildren(circle, event.dx,event.dy);
		},
		
		onend: function(event){
			//stops ensuring that object is ontop after dropped
			var circle = getShapeFromEvent(event);
			circle.element.classList.remove('held-object');
			orderCanvas();
		},
	});

/****
 * Interaction with the "network" class
 ****/
interact('.network')
	
	.dropzone({
		
		accept: '.device, .network',
		
		overlap: 0.7,
		
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
			var draggableElement=event.relatedTarget;
			var dropzoneElement=event.target;
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
				
				if(!partitionExists(dropzone,dragged)){
					var partition=createPartitionGraphic(dropzone,dragged);
				}
				else{
					removePartition(dropzone,dragged);
				}
				snapToLocation(dragged,origin);
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
		    
		    //restricts network to be inside the canvas
		    restrict:{
		        restriction: "parent",
		        endOnly: true,
		        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
		    },
		
			onmove: function (event) {
				var circle = getShapeFromEvent(event);
				moveUIElementAndChildren(circle,event.dx,event.dy);
				updatePartitionLines(circle);
			},
			
			onstart: function(event){
		    	var circle = getShapeFromEvent(event);
				origin.x=circle.x;
				origin.y=circle.y;
				
				//adds class to make sure object you are moving is on top 
				var circle = getShapeFromEvent(event);
				circle.element.classList.add('held-object');
			},
			onend: function(event){
				//stops ensuring that object is ontop after dropped
				var circle = getShapeFromEvent(event);
				circle.element.classList.remove('held-object');
				orderCanvas();
			},
		});

/****
 * --------
 * Utilities and Button Handlers
 * -----------------
 ****/

function snapToLocation(shape,coordinates){
	
	var xdiff=(shape.x-coordinates.x);
	var ydiff=(shape.y-coordinates.y);
	shape.x=coordinates.x;
	shape.y=coordinates.y;
	for(index in shape.children){
		var child=shape.children[index];
		child.x-=xdiff;
		child.y-=ydiff;
		child.draw();
		
	}
	updatePartitionLines(shape);

	shape.draw();
	
}

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
	function toString(el) { 
		return el ? (el.id || el.nodeName) : 'null' ;
	}
	//don't delete this comment i need it
	//console.log("From "+toString(fromElem)+ " to "+toString(toElem));
	if(toString(toElem) == "circle"){
		circleElem=shapes[toElem.getAttribute('data-index')];
		circleElem.nameVisible=true;
		circleElem.draw();
	}
	if(toString(fromElem) == "circle"){
		circleElem=shapes[fromElem.getAttribute('data-index')];
		circleElem.nameVisible=false;
		circleElem.draw();
	}
}
//adds the listener to the document
//document.body.onmouseover =mouseOver;
//document.body.onmouseout = mouseOver;

function updatePartitionLines(networkShape){
	for(index in networkShape.connections){
		var connectedNetwork=networkShape.connections[index];
		var theLine=shapes[index];
		theLine.update(networkShape.x,networkShape.y,connectedNetwork.x,connectedNetwork.y);
		shapes[index]=theLine;
		theLine.draw();
	}
	
}

//checks if an object has a certain class
function hasClass(element, Elclass) {
    return element.classList.contains(Elclass);
}

//moves an element in the GUI and all elements attached to it
function moveUIElementAndChildren(UIShape,dx,dy){
	UIShape.x +=dx;
	UIShape.y += dy;
	for(index in UIShape.children){
		UIShape.children[index].x+=dx;
		UIShape.children[index].y+=dy;
		UIShape.children[index].draw();
	}
	UIShape.draw();
}

function partitionExists(dropzoneObject, dragObject){
	var index=dropzoneObject.connections.indexOf(dragObject);
	return index>-1;
}

function getShapeFromEvent(event){
	var index=event.target.getAttribute('data-index');
	return shapes[index];
}
function getRelatedShapeFromEvent(event){
	var index=event.relatedTarget.getAttribute('data-index');
	return shapes[index];
}
document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY;
}, false);
/****
 * orderCanvas orders all the shapes on the canvas so that devices
 * appear in front of networks, and so that connection lines appear behind the networks
 ****/
function orderCanvas(){
	for (index in shapes){
		if(hasClass(shapes[index].element, 'network')==true&&shapes[index]!=null){
			svgCanvas.appendChild(shapes[index].element);
			svgCanvas.appendChild(shapes[index].displayName);
		}
	}
	for (index in shapes){
		if(hasClass(shapes[index].element, 'device')==true&&shapes[index]!=null){
			svgCanvas.appendChild(shapes[index].element);
			svgCanvas.appendChild(shapes[index].displayName);
		}
	}
	//orders held objects on top
	for (index in shapes){
		if(hasClass(shapes[index].element, 'held-object')==true&&shapes[index]!=null){
			svgCanvas.appendChild(shapes[index].element);
			svgCanvas.appendChild(shapes[index].displayName);
			//order the children devices
			for (var i =0; i<shapes[index].children.length;i++){
				if(shapes[index].children[i]!= null)
					svgCanvas.appendChild(shapes[index].children[i].element);
			}
		}
	}
}

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
	//whether the name of the device is visible
	this.nameVisible=false;
	
	this.element = document.createElementNS(svgNS, 'circle');
	this.element.setAttribute('data-index', uniqueDataIndex);
	this.element.setAttribute('class', elementClass);
	this.children=[];
	this.connections=[];
	
	//displays the name of the network/device
	this.displayName = document.createElementNS(svgNS, "text");
	this.displayName.setAttribute("class", 'name-text');
	this.displayName.setAttribute("font-size","14");
	this.displayName.setAttribute("text-anchor", "middle");
	
	this.draw();
	svgCanvas.appendChild(this.element);
	svgCanvas.appendChild(this.displayName);
}

circle.prototype.draw=function(){
	this.element.setAttribute('cx', this.x); 
	this.element.setAttribute('cy', this.y);
	this.element.setAttribute('r', this.r);
	this.element.setAttribute('stroke', this.stroke);
	
	this.displayName.setAttribute("x", this.x);
	this.displayName.setAttribute("y", this.y - this.r-2);
	
	orderCanvas();
	
	if( this.nameVisible == true){
		//fill this in with actual device name
		this.displayName.textContent=this.element.getAttribute("data-index");
	}
	else{
		this.displayName.textContent='';
	}
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
	this.stroke=4;
	
	this.element = document.createElementNS(svgNS, 'line');
	this.element.setAttribute('data-index', uniqueDataIndex);
	this.element.setAttribute('class', elementClass);
	
	this.draw();
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
line.prototype.update=function(x1,y1,x2,y2){
	this.x1=x1;
	this.y1=y1;
	this.x2=x2;
	this.y2=y2;
}