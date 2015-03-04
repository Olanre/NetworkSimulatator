/**
 * Segment a partition into one made of two partitions
 * @param: network, the network to be assigned its own partition
 * @param: partition, the old partition the network was in to be added
 */
function dividePartition(network, partition){
	var local_session = get_local_simulation();
	if(local_session !== null){
		var params = { 
				'network_name': network_name, 
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
	var local_session = get_local_simulation();
	var params = { 
			'partition_a': partition_a, 
			'partition_b' : partition_b,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/merge/Partitions';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
}
