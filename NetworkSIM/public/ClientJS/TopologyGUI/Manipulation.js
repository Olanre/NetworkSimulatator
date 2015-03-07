// We are using uniqueDataIndex to track shapes. It only ever increases.

var interactable=true;
var uniqueDataIndex=0;

var displayed_partition_list={};

var svgCanvas = document.querySelector('svg'),


//svg is required for the graphics
    svgNS = 'http://www.w3.org/2000/svg',
    shapes=[];

var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY;
}, false);
/****
 * Mouseover function for the GUI
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

/****
 * Generates topology given a partition_list object
 ***/
function generateTopology(partition_list, areaWidth){

	displayed_partition_list=partition_list;
	clearCanvas();
	var positioningRadius,numPartitions,rootXY;
	var networkIndex=0;
	var root,connected,connectedDevice;
	
	var realPartitions=getRealPartitions(partition_list);
	var free_list=getAllFreeDevices(partition_list);

	numPartitions=realPartitions.length;
	positioningRadius=areaWidth/(numPartitions+1);
	rootXY=positioningRadius;
	
	for(partition in realPartitions){
		
		var network_list=partition_list[partition].network_list;
		var angle=Math.PI/network_list.length;

		for(network in network_list){
			
			if(networkIndex==0){
				root=createNetworkGraphicAt(rootXY,rootXY);
				root.name=network_list[network].network_name;
				root.represents=network_list[network];
				connectDevicesToNetwork(network_list[network].device_list,root);
			}
			
			else{
				connected=createObjectWithin(positioningRadius*3/4,networkIndex*angle,rootXY,rootXY,createNetworkGraphicAt);
				connected.name=network_list[network].network_name;
				connected.represents=network_list[network];
				createPartitionGraphic(root,connected);
				connectDevicesToNetwork(network_list[network].device_list,connected);
			}
			networkIndex++;
		}
		
		rootXY+=positioningRadius;
		networkIndex=0;
		
	}
	var distance=areaWidth/(1+free_list.length);
	var freeDevice;
	for(var i=0;i<free_list.length;i++){
		freeDevice=createDeviceGraphicAt(distance*(i+1),20);
		freeDevice.name=free_list[i].current_device_name;
		freeDevice.draw();
	}
		
}

/****
 * -------------------
 * Object Interactions (using interact.js)
 * --------------------
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


			  //tracking for partition list
			  for(index in network.represents.device_list){
			  	if(network.represents.device_list[index]===device.represents){
			  		console.log("removed a device");
			  		network.represents.device_list.splice(index,1);
			  	}
			  }
			  
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

				//tracking the partition list
				dropzone.represents.device_list.push(dragged.represents);
				console.log("added a device");
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
						var localsession=get_local_simulation();
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
 * Checks and updaters
 * ---------
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
//here bool is a true/false boolean
function setInteractable(bool){
	interactable=bool;
}


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