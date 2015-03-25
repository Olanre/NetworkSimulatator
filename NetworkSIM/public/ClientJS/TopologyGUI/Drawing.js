var uniqueDataIndex=0;
var interactable=false;
//var displayed_partition_list={};

var svgCanvas = document.querySelector('svg'),


//svg is required for the graphics
    svgNS = 'http://www.w3.org/2000/svg',
    shapes=[];
function connectDevicesToNetwork(deviceList,networkObject){
	var numDevices=deviceList.length;
	var angle=2*Math.PI/numDevices;
	var connectedDevice;
	var i=0;
	for(device in deviceList){
		connectedDevice=createObjectWithin(40,angle*i,networkObject.x,networkObject.y,createDeviceGraphicAt);
		attachChild(networkObject,connectedDevice);
		connectedDevice.name=deviceList[device].current_device_name;
		connectedDevice.represents=deviceList[device];
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
function clearCanvas(){
	var svgCanvas = document.querySelector('svg');
	if(svgCanvas !== undefined){
		while (svgCanvas.lastChild) {
			svgCanvas.removeChild(svgCanvas.lastChild);
		}
	}
	shapes=[];
}
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

function findPartitionIDForNetwork(networkObject){
	for (var index=0;index<displayed_partition_list.length;index++){
		var networks = displayed_partition_list[index].network_list;

		for(var netindex=0;netindex<networks.length;netindex++){

			if(networks[netindex]._id==networkObject._id){
				return displayed_partition_list[index]._id;
			}
		}
	}
	return -1;
}
/****
 * Generates topology given a partition_list object
 ***/
function generateTopology(partition_list, areaWidth){
	//console.log(partition_list);
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
		freeDevice.represents=free_list[i];
		freeDevice.name=free_list[i].current_device_name;
		freeDevice.draw();
	}

	displayed_partition_list=partition_list;
		
}
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
document.onmouseover = mouseOver;
document.onmouseout = mouseOver;