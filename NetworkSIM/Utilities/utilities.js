exports.size=function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
};


exports.merge_objects = function(obj1,obj2){
	    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	    return obj1;
};
exports.compareObjects=function(obj1,obj2){
	for(key in obj1){
		if(obj2.hasOwnProperty(key)){
			if(obj1[key]!=obj2[key]){
				if(Array.isArray(obj1[key])){
					exports.compareObjects(obj1[key],obj2[key]);
				}
				else return false;
			}
		}
	}
	return true;
};
exports.replaceAll=function(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
};

exports.findSimulationByName=function(simulationName,simulationList){
	for(index in simulationList){
		if (simulationList[index].simulation_name==simulationName) return simulationList[index];

	}
	return -1;
};

exports.getDeviceByUniqueID=function(deviceId,deviceList){
	for(index in deviceList){
		if (deviceList[index]._id==deviceId) return deviceList[index];

	}
	return -1;
};
exports.getNetworkByUniqueID=function(networkId,networkList){
	for(index in networkList){
		if (networkList[index]._id ==networkId) return networkList[index];

	}
	return -1;
};
exports.getPartitionByUniqueID=function(partitionId,partitionList){
	for(index in partitionList){
		if (partitionList[index]._id==partitionId) return partitionList[index];

	}
	return -1;
};

exports.findByUniqueID=function(uniqueID,list){

	for(index in list){
		if(list[index]._id==uniqueID){
			console.log("Found it");
			return list[index];
		} 
	}
	
	return -1;
}
