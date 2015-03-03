/**
 * Helper file for getting elements from Partition_list
 */
/**
 * getPartitions returns the list of partitions for this current simulation
 */
function getPartitions(){
	//gets the current simulation on the user side
	var local_session = get_local_session();
	//gets the configuration of this simulation
	var map = local_session.config_map;
	//holds a list of the partitions
	var list = [];
	for(var partition in map){
		list.push(partition);
	}
	//returns a list of partitions
	return list;
}

/**
 * getNetworks retrieves a list of networks in the simulation
 */
function getNetworks(){
	//gets the local simulation//
	var local_session = get_local_session();
	//gets the configuration map of the current simulation on the users side
	var map = local_session.config_map;
	// a list of all of the networks in the simulation
	var list = []; 
	//populates list
	for (var partition in map){
		for (var network in map[partition]){
			list.push(network);
		}
	}
	return list;
}

/**
 * getDevices returns all of the devices in the current state of the simulation on this users side
 */
function getDevices(){
	//gets the current simulation on the users side
	var local_session = get_local_session();
	//gets the list of networks
	var networklist = getNetworks();
	//list will hold all of the devices in the simulation
	var list = [];
	for( var i = 0; i < networklist.length; i++){
		var devicelist = getDevices(networklist[i]);
		list.push.apply(list, devicelist);
	}
	
	return list;
}

/**
 * getDevices get all the devices within a particular network
 * @param network_name: the name of the network to get all the devices from within
 */
function getDevices(network_name){
	//gets the current simulation as the user sees it
	var local_session = get_local_session();
	//gets the configuration of this simulation
	var map = local_session.config_map;
	//gets the partition that the user is located in 
	partition = getPartition(network_name)
	//list to hold all of the devices within this particular network
	var list = [];
	for(var key in map[partition][network_name]){
		list.push(key);
	}
	return list;
}

/**
 * getLogs returns the activity logs for the current simulation on this device
 */
function getLogs(){
	var local_session = get_local_session();
	return local_session.activity_logs;
}

/**
 * getNetwork gets the name of the network which a device is a member of 
 * @param device_name
 */
function getNetwork(device_name){
	var local_session = get_local_session();
	var map = local_session.config_map;
	//gets the list of networks
	var list = getNetworks();
	//holds the name of the network that this device is present in
	//we should handle the case when the device cannot be found in any of these networks
	var Network_name = '';
	for( var key in map ){
		for( var network in map[key]){
			if(map[key][network][device_name] !== null){
			
				Network_name = network;
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
	var local_session = get_local_session();
	return local_session.simulation_name;
}

/**
 * getVerified returns whether or not this particular user is verified or not
 * for this simulation.
 */
function getVerified(){
	var local_device = get_local_device();
	
	
	return local_device.verified;
}

/**
 * getPartition gets the partition containing a certain network.
 * @param network_name
 */
function getPartition(network_name){
	var local_session = get_local_session();
	var map = local_session.config_map;
	//holds the name of the partition that this network is in
	var Partition_name = '';
	for( var key in map ){
		for( var network in map[key]){
			if (network == network_name){
				var Partition_name = key;
			}
		}
	}
	return Partition_name;
}

function getPartitionfromDevice( device_name){
	network_name =  getNetwork(device_name);
	return getPartition(network_name);
}
