exports.size=function size(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
};


exports.merge_objects = function merge_objects(obj1,obj2){
	    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	    return obj1;
};
exports.compareObjects=function(obj1,obj2){
	if(Object.keys(obj1).length!=Object.keys(obj2).length)return false;
	else{
		var equal=true;
		for(key in obj1){
			if(obj2[key]==obj1[key])equal=true;
			else{
				return false;
			}
		}
		return equal;
	}
};
exports.replaceAll=function(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
};

exports.findSimulationByName=function(simulationName,simulationList){
	for(index in simulationList){
		if (simulationList[index].simulation_name==simulationName) return simulationList[index];

	}
};

exports.findDeviceByName=function(deviceName,deviceList){
	for(index in deviceList){
		if (deviceList[index].device_name==deviceName) return deviceList[index];

	}
};
exports.findNetworkByName=function(networkName,networkList){
	for(index in networkList){
		if (networkList[index].network_name==networkName) return networkList[index];

	}
};
exports.findPartitionByName=function(partitionName,partitionList){
	for(index in partitionList){
		if (partitionList[index].partition_name==partitionName) return partitionList[index];

	}
};