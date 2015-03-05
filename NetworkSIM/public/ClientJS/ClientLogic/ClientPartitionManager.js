/**
 * Segment a partition into one made of two partitions
 */
function dividePartition(network_name, partition_name){
	var local_simulation = get_local_simulation();
	if(local_simulation !== null&&network_name!==null&&partition_name!==null{
		var params = { 
				'network_name': network_name, 
				'partition_name': network_name , 
				'simulation_name': local_simulation.simulation_name,
				};
		var url = '/divide/Partition';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("dividePartition was passed null parameters")
	}
}
/**
 * Merges two partitions into a single partition
 */
function mergePartition(partition_a_name, partition_b_name){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null && partition_a_name!==null && partition_b_name!==null){
		var params = { 
				'partition_a': partition_a, 
				'partition_b' : partition_b,
				'simulation_name': local_simulation.simulation_name,
				};
		var url = '/merge/Partitions';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}
}
