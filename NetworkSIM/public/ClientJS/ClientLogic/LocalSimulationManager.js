/**
 * Helper file for getting elements from simulation object which is stored in local storage and retrieved from the client
 */
/**
 * gets the list of partition id's for this current simulation
 */
function getAllPartitionIds(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var partition_list = local_simulation.partition_list;
		var list = [];
		for(var i = 0; i < partition_list.length; i++){
			//hopefully using this instead of partition_list[i]['_id'] works
			list.push(partition_list[i]._id);
		}
		return list;
	}
	else{
		console.log("Error:getPartitionIds was passsed null parameters");
	}
}


/**
 * gets the list of all network Id's in the simulation
 */
function getAllNetworkIds(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var partition_list = local_simulation.partition_list;
		var list = []; 
		for(var i = 0; i < partition_list.length; i++){
			var networks = partition_list[i].network_list;
			for (var j = 0; j < networks.length; j++){
				list.push(networks[j]._id);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllNetworkIds recieved null local_simulation");
	}
}

/**
 * retrieves a list of all network objects in the simulation
 */
function getAllNetworkObjects(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var partition_list = local_simulation.partition_list;
		var list = []; 
		for(var i = 0; i < partition_list.length; i++){
			var networks = partition_list[i].network_list;
			for (var j = 0; j < networks.length; j++){
				list.push(networks[j]);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllNetworkObjects recieved null simulation object");
	}
}

/**
 * gets all of the tokens of the devices in this simulation
 */
function getAllDeviceTokens(){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		var networklist = getAllNetworkObjects();
		var list = [];
		for( var i = 0; i < networklist.length; i++){
			var devicelist = networklist[i].device_list;
			for(var j = 0; j < devicelist.length; j++){
				list.push(devicelist[j].token);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllDeviceIds recieved null simulation object");
	}
}


/**
 * gets all the device tokens within a particular network object
 */
function getDeviceTokensOfNetwork(network){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		var devicelist = network.device_list;
		for(var j = 0; j < devicelist.length; j++){
			list.push(devicelist[j].token);
		}
		return list;
	}
	else{
		console.log("Error:getDeviceIdsInNetwork was passed a null simulation object");
	}
}

/**
 * gets all of the device objects within a particular network
 */
function getDeviceObectsOfNetwork(network){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var devicelist = network['device_list'];
		for(var j = 0; j < devicelist.length; j++){
			list.push(devicelist[j]);
		}
		return list;
	}
	else{
		console.log("Error:getDeviceObjectsInNetwork was passed a null simulation");
	}
}

/**
 * gets the activity logs for this simulation
 */
function getSimulationActivityLogs(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		return local_simulation.activity_logs;
	}
	else{
		console.log("Error:getSimulationActivityLogs was passed a null simulation object");
	}
}

/**
 * gets the network id that a device is connected to
 */
function getNetworkIdOfDevice(device_token){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null&&device_token!==null){
		var list = getAllNetworkObjects();
		var network_id = '';
		for(var i = 0; i < list.length; i++){
			var device_list = list[i].device_list;
			for(var j = 0; j < device_list.length; j++){
				if(device_list[j].token == device_token){
					network_id = list[i]._id;
				}
			}
		}
		//it's fine if this is blank, as that indicates that the device is not in a network
		return network_id;
	}
	else{
		console.log("Error:getNetworkIdOfDevice recieved null parameters");
	}
}

/**
 * gets the network object which contains a device
 */
function getNetworkObjectOfDevice(device_token){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null&&device_token!==null){
		var list = getNetworks();
		var network_obj = null;
		for(var i = 0; i < list.length; i++){
			var devicelist = list[i].device_list;
			for(var j = 0; j < devicelist.length; j++){
				if(devicelist[j].token == device_token){
					network_obj = list[i];
				}
			}
		}
		return network_obj;
	}
	else{
		console.log("Error:Error:getNetworkObjectOfDevice was passed null parameters");
	}
}

/**
 * gets the unique id of the partition which a network is in.
 */
function getPartitionIdOfNetwork(network_id){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var partition_list = local_simulation.partition_list;
		var partition_id = '';
		for(var i = 0; i < partition_list.length; i++){
			var networks = partion_list[i].network_list;
			for(var j = 0; j < networks.length; j++){
				if(networks[j]._id == network_id){
					partition_id = partition_list[i]._id;
				}
			}	
		}
		//returning a null or empty partition_id means that the network is not in a partition
		return partition_id;
	}
	else{
		console.log("Error:getPartitionName was passed null parameters");
	}
}

/**
 * gets the partition object that a network is in
 */
function getPartitionObjectOfNetwork(network_id){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var partition_list = local_simulation.partition_list;
		var partition_obj = '';
		for(var i = 0; i < partition_list.length; i++){
			var networks = partion_list[i].network_list;
			for(var j = 0; j < networks.length; j++){
				if(networks[j]._id == network_id){
					
					partition_obj = partition_list[i];
				}
			}
		}
		return partition_obj;
	}
	else{
		console.log("Error:getPartitionObjectOfNetwork was passed null parameters");
	}
}

/**
 * gets the partition that a particular device is in
 */
function getPartitionIdOfDevice( device_id){
	if(device_id!==null){
		var Partition_id = '';
		network_id =  getNetworkIdOfDevice(device_name);
		if(network_id !== ''){
			Partition_id =  getPartitionIdOfNetwork(network_id);
		}
		//if empty string is returned, means the device is not in a network.
		return Partition_id;
	}
	else{
		console.log("Error:getPartitionIdFromDevice was passed null parameters");
	}
}

/**
 * Gets the unique Id of this simulation
 */
function getLocalSimulationId(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		return local_simulation._id;
	}
	else{
		console.log("Error:getLocalSimulationId passed null simulation object")
	}
}