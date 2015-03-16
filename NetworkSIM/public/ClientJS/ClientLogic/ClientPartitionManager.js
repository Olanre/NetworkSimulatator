/**
 * Segment a partition into one made of two partitions
 */
function dividePartition(split_networks_list, partition_id){
	var local_simulation = get_local_simulation();
	if(local_simulation !== null && split_networks_list!==null && partition_id!==null){
		var params = { 
				'split_networks_list': split_networks_list, 
				'partition_id': partition_id, 
				'simulation_id': local_simulation._id,
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
function mergePartition(partition_a_id, partition_b_id){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null && partition_a_id!==null && partition_b_id!==null){
		var params = { 
				'partition_a_id': partition_id, 
				'partition_b_id' : partition_id,
				'simulation_id': local_simulation._id,
				};
		var url = '/merge/Partitions';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}
}
