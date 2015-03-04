function createNetwork(network_name){
	//gets the user information from storage
	var local_device = get_local_device();
	var local_session = get_local_simulation();
	var local_application = get_local_application();
	var partition = network_name;
	
	var params = { 
			'network_name': network_name, 
			'partition_name': partition , 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/create/Network';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	appDefaultView();
	//add to eventQueue
	//render Application View
	
}

/**
 * deleteNetwork deletes a network within a partition
 * @network_name: the name of the network to delete
 * @partition_name: the name of the partition in which that network resides
 */
function deleteNetwork(network_name){
	var local_device = get_local_device();
	var local_session = get_local_simulation();
	//network should only be stored in one object not two
	//should check if the network was created by the user
	var Partition_name = getPartition(network_name);
	
	var params = { 
			'network_name': network_name, 
			'partition_name' : Partition_name,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/delete/Network';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timestamp);
	
	
}


