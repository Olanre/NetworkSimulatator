function createNetwork(network_name){
	//generates a uniqueID
	var network_name = generateUniqueID('network');
	//the name of the partition to be created
	var partition_name = generateUniqueID('partition');
	var local_simulation = get_local_simulation();
	var params = { 
			'network_name': network_name, 
			'partition_name': partition_name , 
			'simulation_name': local_simulation.simulation_name,
			};
	var url = '/create/Network';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	appDefaultView();
}


