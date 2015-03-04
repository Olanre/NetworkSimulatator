/**
 * Segment a partition into one made of two partitions
 */
function dividePartition(network, partition){
	var local_simulation = get_local_simulation();
	if(local_simulation !== null){
		var params = { 
				'network_name': network_name, 
				'partition_name': network_name , 
				'simulation_name': local_simulation.simulation_name,
				};
		var url = '/divide/Partition';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("Local simulation session not found")
	}
}

function mergePartition(partition_a, partition_b){
	var local_simulation = get_local_simulation();
	var params = { 
			'partition_a': partition_a, 
			'partition_b' : partition_b,
			'simulation_name': local_simulation.simulation_name,
			};
	var url = '/merge/Partitions';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
}
