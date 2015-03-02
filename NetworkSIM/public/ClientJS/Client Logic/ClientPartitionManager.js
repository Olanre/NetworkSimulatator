/**
 * Segment a partition into one made of two partitions
 * @param: network, the network to be assigned its own partition
 * @param: partition, the old partition the network was in to be added
 */
function dividePartition(network, partition){
	var local_session = get_local_session();
	if(local_session !== null){
		delete local_session.config_map[partiton][network];
		local_session.config_map[network] = network;
		console.log(local_session.config_map);
		putinStorage( 'session', JSON.stringify(local_session) );
		
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