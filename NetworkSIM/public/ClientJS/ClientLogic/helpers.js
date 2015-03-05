/**
 * Helper file for getting elements from Partition_list
 */
/**
 * getPartitionNames returns the list of partitions for this current simulation
 */
function getPartitionNames(){
	//gets the current simulation on the user side
	var local_simulation = get_local_simulation();
	//gets the configuration of this simulation
	var partition_list = local_simulation.partition_list;
	//holds a list of the partitions
	var list = [];
	for(var i = 0; i < partition_list.length; i++){
		list.push(partition_list[i]['partition_name']);
	}
	//returns a list of partitions
	return list;
}


/**
 * getNetworkNames retrieves a list of networks in the simulation
 */
function getNetworkNames(){
	//gets the local simulation//
	var local_simulation = get_local_simulation();
	//gets the configuration map of the current simulation on the users side
	var partition_list = local_simulation.partition_list;
	// a list of all of the networks in the simulation
	var list = []; 
	//populates list
	for(var i = 0; i < partition_list.length; i++){
		var networks = partition_list[i]['network_list'];
		for (var j = 0; j < networks.length; j++){
			list.push(networks[j]['network_name']);
		}
	}
	return list;
}

/**
 * getNetworkNames retrieves a list of networks in the simulation
 */
function getNetworkObjs(){
	//gets the local simulation//
	var local_simulation = get_local_simulation();
	//gets the configuration map of the current simulation on the users side
	var partition_list = local_simulation.partition_list;
	// a list of all of the networks in the simulation
	var list = []; 
	//populates list
	for(var i = 0; i < partition_list.length; i++){
		var networks = partition_list[i]['network_list'];
		for (var j = 0; j < networks.length; j++){
			list.push(networks[j]);
		}
	}
	return list;
}

/**
 * getDeviceNames returns all of the devices in the current state of the simulation on this users side
 */
function getDeviceNames(){
	//gets the current simulation on the users side
	var local_simulation = get_local_simulation();
	//gets the list of networks
	var networklist = getNetworkObjs();
	var freeList = local_simulation.freelist;
	//list will hold all of the devices in the simulation
	var list = [];
	for( var i = 0; i < networklist.length; i++){
		var devicelist = networklist[i]['device_list'];
		for(var j = 0; j < devicelist.length; j++){
			list.push(devicelist[j]['current_device_name']);
		}
		
	}
	for(var j = 0; j < freelist.length; j++){
		list.push(freelist[j]['current_device_name']);
	}
	
	return list;
}


/**
 * getDeviceNames get all the device names within a particular network
 * @param network_name: the name of the network to get all the devices from within
 */
function getDeviceNames(network){
	//gets the current simulation as the user sees it
	var local_simulation = get_local_simulation();
	//gets the configuration of this simulation
	var devicelist = network['device_list'];
	for(var j = 0; j < devicelist.length; j++){
		list.push(devicelist[j]['current_device_name']);
	}
	return list;
}

/**
 * getDevicesObjs get all the device objects within a particular network
 * @param network_name: the name of the network to get all the devices from within
 */
function getDeviceObjs(network){
	//gets the current simulation as the user sees it
	var local_simulation = get_local_simulation();
	var local_simulation = get_local_simulation();
	//gets the configuration of this simulation
	var devicelist = network['device_list'];
	for(var j = 0; j < devicelist.length; j++){
		list.push(devicelist[j]);
	}
	return list;
}

/**
 * getLogs returns the activity logs for the current simulation on this device
 */
function getLogs(){
	var local_simulation = get_local_simulation();
	return local_simulation.activity_logs;
}

/**
 * getNetworkName gets the name of the network which a device is a member of 
 * @param device_name
 */
function getNetworkName(device_name){
	var local_simulation = get_local_simulation();
	//gets the list of networks
	var list = getNetworkObjs();
	//holds the name of the network that this device is present in
	//we should handle the case when the device cannot be found in any of these networks
	var Network_name = '';
	for(var i = 0; i < list.length; i++){
		var devicelist = list[i]['device_list'];
		for(var j = 0; j < devicelist.length; j++){
			if(devicelist[j]['current_device_name'] !== device_name){
				
				Network_name = list[i]['network_name'];
			}
		}
		
	}

	//returns the name of the network that this device is in
	return Network_name;
}

/**
 * getNetworkObj gets the name of the network which a device is a member of 
 * @param device_name
 */
function getNetworkObj(device_name){
	var local_simulation = get_local_simulation();
	//gets the list of networks
	var list = getNetworks();
	//holds the name of the network that this device is present in
	//we should handle the case when the device cannot be found in any of these networks
	var Network_obj = null;
	for(var i = 0; i < list.length; i++){
		var devicelist = list[i]['device_list'];
		for(var j = 0; j < devicelist.length; j++){
			if(devicelist[j]['current_device_name'] !== device_name){
				
				Network_obj = list[i];
			}
		}
		
	}
	//returns the name of the network that this device is in
	return Network_name;
}

/**
 * getToken gets the token associated with this particular user
 */
function getToken(){
	var local_device = get_local_device();
	return local_device.token;
}

function getSimulationName(){
	var local_simulation = get_local_simulation();
	return local_simulation.simulation_name;
}

/**
 * getVerified returns whether or not this particular user is verified or not
 * for this simulation.
 */
function getVerified(){
	var local_device = get_local_device();
	
	if(local_device.hasOwnProperty('verified')){
		return local_device.verified;
	}else{
		return false;
	}
	
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
	network_name =  getNetwork(device_name);
	return getPartition(network_name);
}
