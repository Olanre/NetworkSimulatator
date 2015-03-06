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

exports.findDeviceByName=function(deviceName,deviceList){
	for(index in deviceList){
		if (deviceList[index].device_name==deviceName) return deviceList[index];

	}
	return -1;
};
exports.findNetworkByName=function(networkName,networkList){
	for(index in networkList){
		if (networkList[index].network_name==networkName) return networkList[index];

	}
	return -1;
};
exports.findPartitionByName=function(partitionName,partitionList){
	for(index in partitionList){
		if (partitionList[index].partition_name==partitionName) return partitionList[index];

	}
	return -1;
};

exports.findByUniqueID=function(uniqueID,list){

	for(index in list){

		if(list[index]._id.valueOf()===uniqueID.valueOf()){
			return list[index];
		} 
	}
	
	return -1;
}
