interactable=true;

var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};
var waitTime=800;
document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY;
}, false);

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
	    	if(interactable){
				//adds class to make sure object you are moving is on top 
				var shape = getShapeFromEvent(event);
				shape.element.classList.add('held-object');
			}
		},

		onmove: function (event) {
			if(interactable){
				//gets the circle from the list of shapes
				var shape = getShapeFromEvent(event);
				moveUIElementAndChildren(shape, event.dx,event.dy);
			}
		},
		
		onend: function(event){
			if(interactable){
				//stops ensuring that object is ontop after dropped
				var shape = getShapeFromEvent(event);
				shape.element.classList.remove('held-object');
				orderCanvas();
			}
		},
	});

/**
 * Handles moving a network object in the topology view
 */
interact('.network')
	
	.dropzone({
		
		accept: '.device, .network', 
		
		overlap: 0.7,
		
		ondropactivate: function(event){
			if(interactable){
				event.target.classList.add('drop-locations');
			}
		},
		
		ondragenter: function (event) {
			if(interactable){
			    var draggableElement = event.relatedTarget,
			        dropzoneElement = event.target;
			    
			    if (draggableElement.classList.contains('device')){
				    dropzoneElement.classList.add('drop-target');
				    draggableElement.classList.add('connected-device');
			    }
			}
		},

		ondragleave: function (event) {
			if(interactable){
				event.target.classList.remove('drop-target');
				event.relatedTarget.classList.remove('connected-device');
				var network=getShapeFromEvent(event);
				var networkIndex=event.target.getAttribute('data-index');
				var device=getRelatedShapeFromEvent(event);
				var deviceIndex=event.relatedTarget.getAttribute('data-index');
				delete network.children[deviceIndex];
			}
		},

		
		ondrop: function (event) {
			if(interactable){
				var draggableElement=event.relatedTarget;
				var dropzoneElement=event.target;
				var dragClass=draggableElement.classList[0];
				
				var dropzone=getShapeFromEvent(event);
				var dragged=getRelatedShapeFromEvent(event);
				
				if(dragClass==='device'){
					attachChild(dropzone,dragged);
					
					deviceName=shapes[draggableElement.getAttribute('data-index')].name;
					newNetworkName=shapes[dropzoneElement.getAttribute('data-index')].name;

					moveDeviceToNetwork(dragged.represents.token,dropzone.represents._id);
					setTimeout(updateTopology(shapes,get_local_simulation().partition_list),waitTime);
				}
			}
			if(dragClass==='network'){
				if(interactable){
					var circleDragging = shapes[draggableElement.getAttribute('data-index')];
					var circleDraggedTo = shapes[dropzoneElement.getAttribute('data-index')];
					
					if(!partitionExists(dropzone,dragged)){

						var partition=createPartitionGraphic(dropzone,dragged);
						var partitionA = findPartitionIDForNetwork(dropzone.represents);
						var partitionB = findPartitionIDForNetwork(dragged.represents);
						if(partitionA!=partitionB){
							mergePartition(partitionA,partitionB);
							setTimeout(updateTopology(shapes,get_local_simulation().partition_list),waitTime);
						}
					}
					else{
						var oldpartitionID=findPartitionIDForNetwork(dragged.represents);

						removePartition(dropzone,dragged);

						var newpartitionlist=breadthFirstSearch(dropzone,dragged);
						var connected=false;
						for(partition in newpartitionlist){
							if(newpartitionlist[partition]==dragged){
								connected=true;
							}
						}

						if(!connected){
							var list = [];
							for(var i=0;i<newpartitionlist.length;i++){
								list.push(newpartitionlist[i].represents);
							}
							dividePartition(list,oldpartitionID);
							setTimeout(updateTopology(shapes,get_local_simulation().partition_list),waitTime);
						}
					}
					snapToLocation(dragged,origin);
				}
			}
		
		},

		ondropdeactivate: function (event) {
			if(interactable){
				event.target.classList.remove('drop-locations');
			    event.target.classList.remove('drop-target');
			    //HERE SHOULD BE WHERE YOU TEST IF YOU DROP THIS INTO
			    //THE FREE LIST
			}
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
				if(interactable){
					var shape = getShapeFromEvent(event);
					moveUIElementAndChildren(shape,event.dx,event.dy);
					updatePartitionLines(shape);
				}
			},
			
			onstart: function(event){
				if(interactable){
			    	var shape = getShapeFromEvent(event);
					origin.x=shape.x;
					origin.y=shape.y;
					
					//adds class to make sure object you are moving is on top 
					var shape = getShapeFromEvent(event);
					shape.element.classList.add('held-object');
				}
			},
			onend: function(event){
				if(interactable){
					//stops ensuring that object is ontop after dropped
					var shape = getShapeFromEvent(event);
					shape.element.classList.remove('held-object');
					orderCanvas();
				}
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

/****
 * orderCanvas orders all the shapes on the canvas so that devices
 * appear in front of networks, and so that connection lines appear behind the networks
 ****/
