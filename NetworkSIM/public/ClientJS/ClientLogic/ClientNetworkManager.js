function createNetwork(network_name){
	//generates a uniqueID
	var network_name = generateUniqueID('partition_name');
	var partition_name = generateUniqueID('partition')
	var local_simulation = get_local_simulation();
	//SHOULD CREATE A PARTITION FIRST
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


