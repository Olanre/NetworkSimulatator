/**
 * Segment a partition into one made of two partitions
 * @param: network, the network to be assigned its own partition
 * @param: partition, the old partition the network was in to be added
 */
function dividePartition(network, partition){
	var local_session = get_local_session();
	if(local_session !== null){
		var params = { 
				'config_map' : local_session.config_map,
				'network': network_name, 
				'partition_name': network_name , 
				'simulation_name': local_session.simulation_name,
				};
		var url = '/divide/Partition';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("Local simulation session not found")
	}
}

function mergePartition(partition_a, partition_b){
	var local_session = get_local_session();
	var params = { 
			'config_map' : local_session.config_map,
			'partition_a': partition_a, 
			'partition_b' : partition_b,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/merge/Partitions';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
}

/**
 * removeDevicefromFreeList: remove a device from the freelist
 * @param device_name: the name of the device to removed from the free list
 */
function removeDevicefromFreeList( device_name, simulation_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	if(local_session !== null){		
		var params = { 
				'partition_list' : local_session.partition_list,
				'simulation_name': local_session.simulation_name,
				'device_name' :  device_name
				};
		var url = '/remove/Device/FreeList';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("local simulation session not found!");
	}
	
}