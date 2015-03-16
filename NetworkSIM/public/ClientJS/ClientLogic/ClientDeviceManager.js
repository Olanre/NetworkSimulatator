/** 
 * Creates a new device in this simulation. This is not what is called when a simulation is created,
 * that is coming different.
 */
function createDevice(device_name){
	var local_simulation = get_local_simulation();
	if(local_simuation!==null){
		var params = { 
				'device_name': device_name, 
				'simulation_id': local_simulation._id,
				};
		var url = '/create/Device';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
		addDeviceToFreeList( device_name );
	}
	else{
		console.log("createDevice was passed null parameters");
	}
}

/** 
 * moves a device to a network
 */
function moveDeviceToNetwork( device_token, network_id){
	var local_simulation = get_local_simulation();
	if (device_token!==null &&network_id!==null && local_simulation!==null){
		var params = {
				'network_id':network_id,
				'simulation_id':local_simulation._id,
				'device_token':device_token
			};
		var url='/move/Device/Network';
		var timestamp = new Date();
		addToEventQueue(url,params,timestamp);
	}
	else{
		console.log("moveDeviceToNetwork recieved null parameters");
	}
}