function updateTopology(shapesList,partitionList){

	var network_list,device_list;
	var networkShape,deviceShape;
	for(pIndex in partitionList){

		network_list=partitionList[pIndex].network_list;

		for(nIndex in network_list){
			networkShape = findCorrespondingShape(shapesList, network_list[nIndex]);

			if(networkShape!=-1){
				networkShape.represents=network_list[nIndex];
			}
			else{
				//in this case, there does not exist a graphic to display this network. Right now if this happens, there's a bug
				console.log("There's an error with a network!");
			}
			device_list= network_list[nIndex].device_list;

			for(dIndex in device_list){
				deviceShape = findCorrespondingShape(shapesList, device_list[dIndex]);

				if(deviceShape!=-1){
					deviceShape.represents = device_list[dIndex];
				}
				else{
					console.log("There's an error with a device!");
				}
			}

		}
	}
}
//lol i love writing bad code
function findCorrespondingShape(shapesList,item){

	for(index in shapesList){
		if(shapesList[index].represents==undefined){//shape is a line
		}
		else{
			if(shapesList[index].represents._id==item._id)return shapesList[index];
		}
	}
	return -1;
}