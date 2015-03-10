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
