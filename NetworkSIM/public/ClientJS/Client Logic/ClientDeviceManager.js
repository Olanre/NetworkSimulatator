/** Function to create a new device in the simulation
 * The new device with the specified is added t the free list 
 * the number of devices in the simulation and eventqueue is then updated 
 * 
 * @param device_name, the name of the device to be added
 */
function createDevice(device_name){
	
	addDevice2FreeList( device_name );
	
	var local_session = get_local_session();
	
	var new_number = local_session.num_devices + 1;
	
	updateDeviceNumber(new_number);
	network = getNetwork( device_name);
	partition = getPartitionfromDevice( device_name);
	
	var params = { 
			'config_map' : local_session.config_map,
			'network_name' : network,
			'partition_name' : partition,
			'device_name': device_name, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/create/Device';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	
	
}