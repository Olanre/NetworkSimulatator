// We are using uniqueDataIndex to track shapes. It only ever increases.

var interactable=true;
var uniqueDataIndex=0;
var svgCanvas = document.querySelector('svg'),

//svg is required for the graphics
    svgNS = 'http://www.w3.org/2000/svg',
    shapes=[];

var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};
var testConfigMap1={
		 'Partition1': 
		 {'networka' :
		 { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 'networkb' :
		 		{ 'deviced': '4', 'devicee': '5'},
		 				},
		  'Partition2':
		 { 'networkc' :
		 { 'devicef': '6', 'deviceg@mun.ca' : '7',  'deviceh@mun.ca': '8'},
		 'networkd' :
		 		{'devicei@mun.ca':'9', 'device@mun.ca': '10'},
		 		'networkTest':{},
		 				},
		  'Partition3':
		 { 'networke' : { 'devicek':'11'} },
		 'freelist' : {'devicew': '13', 'evicex' : '14'}
		 };
var testConfigMap2={
		 'Partition1': 
		 {'networka' :
		 { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 'networkb' :{ 'deviced': '1', 'devicee': '2'},
 		'networkc' :{ 'deviced': '1', 'devicee': '2'},
 		'networkd' :{ 'deviced': '1', 'devicee': '2'},
 		'networke' :{ 'deviced': '1', 'devicee': '2'},
		 				},
		 'freelist' : {'devicew': '13', 'evicex' : '14','device1' :'22','device2' :'22','device3' :'22','device4' :'22'}
		 };
var testConfigMap3={
		'Partition1':
		 { 'networka' : { 'deviceA':'11','deviceB':'11','deviceC':'11','deviceD':'11','deviceE':'11'} },
		 'Partition2':
		 { 'networkb' : { 'device':'11'} },
		 'Partition3':
		 { 'networkc' : { 'device':'11'} },
		 'Partition4':
		 { 'networkd' : { 'device':'11'} },
		 'Partition5':
		 { 'networke' : { 'device':'11'} },
		 'freelist':{}
}


/****
 * Generates topology given a simulation object
 ***/
function generateTopology(configMap, areaWidth){
	//clear the svgCanvas
	clearCanvas();
	var positioningRadius,numPartitions,rootXY;
	var networkIndex=0;
	var root,connected,connectedDevice;
	
	numPartitions=Object.keys(configMap).length;
	positioningRadius=areaWidth/(numPartitions);
	rootXY=positioningRadius;
	
	for(partition in configMap){
		
		if(partition!='freelist'){
			var angle=Math.PI/Object.keys(configMap[partition]).length;
			
			for(network in configMap[partition]){
				
				if(networkIndex==0){
					root=createNetworkGraphicAt(rootXY,rootXY);
					root.name=network;
					connectDevicesToNetwork(configMap[partition][network],root);
				}
				
				else{
					connected=createObjectWithin(positioningRadius*3/4,networkIndex*angle,rootXY,rootXY,createNetworkGraphicAt);
					connected.name=network;
					createPartitionGraphic(root,connected);
					connectDevicesToNetwork(configMap[partition][network],connected);
				}
				networkIndex++;
			}
			
			rootXY+=positioningRadius;
			networkIndex=0;
		}
		
		else{
			var distance=areaWidth/(1+Object.keys(configMap[partition]).length);
			var freeDevice;
			deviceIndex=0;
			for(device in configMap[partition]){
				freeDevice=createDeviceGraphicAt(distance*(deviceIndex+1),20);
				freeDevice.name=device;
				freeDevice.draw();
				deviceIndex++;
			}
		}
		
	}
		
}
function connectDevicesToNetwork(deviceList,networkObject){
	var numDevices=Object.keys(deviceList).length;
	var angle=2*Math.PI/numDevices;
	var connectedDevice;
	var i=0;
	for(device in deviceList){
		connectedDevice=createObjectWithin(40,angle*i,networkObject.x,networkObject.y,createDeviceGraphicAt);
		attachChild(networkObject,connectedDevice);
		connectedDevice.name=device;
		connectedDevice.draw();
		i++;
	}
}
function createNetworkGraphic(){
	return createNetworkGraphicAt(100,500);
}

function createDeviceGraphic(){
	return createDeviceGraphicAt(50,50);
}

function createNetworkGraphicAt(xPosition, yPosition){
	var  network=new circle(xPosition, yPosition, 60, svgCanvas, 'network');
	shapes[uniqueDataIndex]=(network);
	uniqueDataIndex++;
	return network;
}

function createDeviceGraphicAt(xPosition, yPosition){
	var device=new circle(xPosition, yPosition, 10, svgCanvas, 'device');
	shapes[uniqueDataIndex]=(device);
	uniqueDataIndex++;
	return device;
}

function createPartitionGraphic(sourceNetwork, destinationNetwork){
	var connection=new line(sourceNetwork.x,sourceNetwork.y,destinationNetwork.x, destinationNetwork.y,svgCanvas,'network-connection');
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
function attachChild(parentShape, childShape){
	var index=shapes.indexOf(childShape);
	parentShape.children[index]=childShape;
	childShape.element.classList.add('connected-device');
	index=shapes.indexOf(parent);
}

function createObjectWithin(radius,angle,centerX,centerY,createFunction){
	var xpos=radius*Math.sin(angle);
	var ypos=radius*Math.cos(angle);
	var graphic=createFunction(centerX+xpos,centerY+ypos);
	return graphic;
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
			var shape = getShapeFromEvent(event);
			shape.element.classList.add('held-object');
		},

		onmove: function (event) {
		
		//gets the circle from the list of shapes
			var shape = getShapeFromEvent(event);
			moveUIElementAndChildren(shape, event.dx,event.dy);
		},
		
		onend: function(event){
			//stops ensuring that object is ontop after dropped
			var shape = getShapeFromEvent(event);
			shape.element.classList.remove('held-object');
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
		
		ondropactivate: function(event){
			
			event.target.classList.add('drop-locations');
		},
		
		ondragenter: function (event) {

		    var draggableElement = event.relatedTarget,
		        dropzoneElement = event.target;
		    
		    if (draggableElement.classList.contains('device')){
			    dropzoneElement.classList.add('drop-target');
			    draggableElement.classList.add('connected-device');
			    //draggableElement.textContent = 'Dragged in';
		    }
		},

		ondragleave: function (event) {
			
			  event.target.classList.remove('drop-target');
			  event.relatedTarget.classList.remove('connected-device');
			  var network=getShapeFromEvent(event);
			  var networkIndex=event.target.getAttribute('data-index');
			  var device=getRelatedShapeFromEvent(event);
			  var deviceIndex=event.relatedTarget.getAttribute('data-index');
			  delete network.children[deviceIndex];
			  
		},

		
		ondrop: function (event) {
			var draggableElement=event.relatedTarget;
			var dropzoneElement=event.target;
			var dragClass=draggableElement.classList[0];
			
			var dropzone=getShapeFromEvent(event);
			var dragged=getRelatedShapeFromEvent(event);
			
			if(dragClass==='device'){
				attachChild(dropzone,dragged);
				
				deviceName=shapes[draggableElement.getAttribute('data-index')].name;
				newNetworkName=shapes[dropzoneElement.getAttribute('data-index')].name;
				//THIS IS STUFF TO INTERACT WITH MAINJS
				//addDevice(deviceName, newNetworkName);
				//this does not handle moving in and out of the free-list
				
			}
			if(dragClass==='network'){
				var circleDragging = shapes[draggableElement.getAttribute('data-index')];
				var circleDraggedTo = shapes[dropzoneElement.getAttribute('data-index')];
				
				if(!partitionExists(dropzone,dragged)){
					//check if already in this partition
					var partition=createPartitionGraphic(dropzone,dragged);
					/*
					//THIS IS STUFF TO INTERACT WITH MAINJS
					oldNetworkName=shapes[draggableElement.getAttribute('data-index')].name;
					newNetworkName=shapes[dropzoneElement.getAttribute('data-index')].name;
					
					oldNetworkPartition= getPartition(oldNetworkName);
					newNetworkPartition= getPartition(newNetworkName);
					
					mergePartition(oldNetworkPartition, newNetworkPartition);*/
				}
				else{
					removePartition(dropzone,dragged);
					/*
					//what if we're breaking in half or just removing an extraneous line
					//THIS IS STUFF TO INTERACT WITH MAINJS
					breakApart=shapes[draggableElement.getAttribute('data-index')].name;
					newNetworkName=shapes[dropzoneElement.getAttribute('data-index')].name;
					
					newNetworkPartition= getPartition(newNetworkName);
					
					dividePartition(oldNetwork)*/
					var newpartitionlist=breadthFirstSearch(dropzone,dragged);
					var connected=false;
					for(partition in newpartitionlist){
						if(newpartitionlist[partition]==dragged){
							connected=true;
						}
					}
					if(!connected){
						var oldpartition=buildPartition(newpartitionlist);
						newpartitionlist=breadthFirstSearch(dragged);
						var newpartition=buildPartition(newpartitionlist);
						//depends on bad.js :)
						var localsession=get_local_session();
						var partitionname=getPartition(dragged.name);
						localsession.config_map[partitionname]=oldpartition;
						//depends on utilities.js
						partitionname=generateUniqueId();
						localsession.config_map[partitionname]=newpartition;
					}
				}
				snapToLocation(dragged,origin);
			}
		
		},

		ondropdeactivate: function (event) {
			
			event.target.classList.remove('drop-locations');
		    event.target.classList.remove('drop-target');
		    //HERE SHOULD BE WHERE YOU TEST IF YOU DROP THIS INTO
		    //THE FREE LIST
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
				var shape = getShapeFromEvent(event);
				moveUIElementAndChildren(shape,event.dx,event.dy);
				updatePartitionLines(shape);
			},
			
			onstart: function(event){
		    	var shape = getShapeFromEvent(event);
				origin.x=shape.x;
				origin.y=shape.y;
				
				//adds class to make sure object you are moving is on top 
				var shape = getShapeFromEvent(event);
				shape.element.classList.add('held-object');
			},
			onend: function(event){
				//stops ensuring that object is ontop after dropped
				var shape = getShapeFromEvent(event);
				shape.element.classList.remove('held-object');
				orderCanvas();
			},
		});

/****
 * --------
 * Utilities and Button Handlers
 * -----------------
 ****/

//clears the svg canvas
function clearCanvas(){
	while (svgCanvas.lastChild) {
		svgCanvas.removeChild(svgCanvas.lastChild);
	}
	shapes=[];
}

//here bool is a true/false boolean
function setInteractable(bool){
	interactable=bool;
}

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
document.body.onmouseover =mouseOver;
document.body.onmouseout = mouseOver;

function updatePartitionLines(networkShape){
	for(index in networkShape.connections){
		var connectedNetwork=networkShape.connections[index];
		var theLine=shapes[index];
		theLine.update(networkShape.x,networkShape.y,connectedNetwork.x,connectedNetwork.y);
		theLine.draw();
	}
	
}

function hasClass(element, Elclass) {
    return element.classList.contains(Elclass);
}

function moveUIElementAndChildren(UIShape,dx,dy){
	if(interactable==true){
		UIShape.x +=dx;
		UIShape.y += dy;
		for(index in UIShape.children){
			UIShape.children[index].x+=dx;
			UIShape.children[index].y+=dy;
			UIShape.children[index].draw();
		}
		UIShape.draw();
	}
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
	this.name="";
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
	if(this.nameVisible==true){
		this.displayName.textContent=this.name;
	}
	else{
		this.displayName.textContent="";
	}
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
//generateTopology(testConfigMap,800);
//generateTopology(testConfigMap1,800);