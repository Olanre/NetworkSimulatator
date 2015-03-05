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
		console.log("getPartitionIds was passsed null parameters");
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
		console.log("getAllNetworkIds recieved null local_simulation");
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
		console.log("getAllNetworkObjects recieved null simulation object");
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
		console.log("getAllDeviceIds recieved null simulation object");
	}
}


/**
 * gets all the device tokens within a particular network object
 */
function getDeviceTokensInNetwork(network){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		var devicelist = network.device_list;
		for(var j = 0; j < devicelist.length; j++){
			list.push(devicelist[j].token);
		}
		return list;
	}
	else{
		console.log("getDeviceIdsInNetwork was passed a null simulation object");
	}
}

/**
 * gets all of the device objects within a particular network
 */
function getDeviceObectsInNetwork(network){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var devicelist = network['device_list'];
		for(var j = 0; j < devicelist.length; j++){
			list.push(devicelist[j]);
		}
		return list;
	}
	else{
		console.log("getDeviceObjectsInNetwork was passed a null simulation");
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
		console.log("getSimulationActivityLogs was passed a null simulation object");
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
		console.log("getNetworkIdOfDevice recieved null parameters");
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
		console.log("getNetworkObjectOfDevice was passed null parameters")
	}
}
/**
 * Gets the 
 */
function getSimulationId(){
	var local_simulation = get_local_simulation();
	return local_simulation.simulation_name;
}

/**
 * getPartitionName gets the partition name containing a certain network.
 * @param network_name
 */
function getPartitionName(network_name){
	var local_simulation = get_local_simulation();
	var partition_list = local_simulation.partition_list;
	//holds the name of the partition that this network is in
	var Partition_name = '';
	for(var i = 0; i < partition_list.length; i++){
		var networks = partion_list[i]['network_list'];
		for(var j = 0; j < networks.length; j++){
			if(networks[j]['network_name'] !== network_name){
				
				Partition_name = partition_list[i]['partition_name'];
			}
		}
		
	}
	return Partition_name;
}

/**
 * getPartitionObj gets the partition object containing a certain network.
 * @param network_name
 */
function getPartitionObj(network_name){
	var local_simulation = get_local_simulation();
	var partition_list = local_simulation.partition_list;
	//holds the name of the partition that this network is in
	var Partition_obj = '';
	for(var i = 0; i < partition_list.length; i++){
		var networks = partion_list[i]['network_list'];
		for(var j = 0; j < networks.length; j++){
			if(networks[j]['network_name'] !== network_name){
				
				Partition_obj = partition_list[i];
			}
		}
		
	}
	return Partition_obj;
}

function getPartitionNamefromDevice( device_name){
	var Partition_name = '';
	network_name =  getNetworkName(device_name);
	if(network_name !== ''){
		Partition_name =  getPartitionName(network_name);
	}
	return Partition_name;
}
