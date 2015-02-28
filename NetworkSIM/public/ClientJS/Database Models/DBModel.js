/**
 * This module contains all database modeling code. Copied from main.js. This modification
 * is necessary in following proper Model-View-Controller design pattern and decoupling 
 * modules. 
 */

/********* Model Modifiers - line 2376 to ... **********************/

/**
 * get_local_device retrieves the information about this device
 * from the local database.
 */
function get_local_device(){
	return JSON.parse(getfromStorage('device'));
}

/** Function to get the simulation session from local database
 * @reutrn, a JSON representation of the object in storage
 */
function get_local_session(){
	return JSON.parse(getfromStorage('session'));
}

/** Function to get the current application from local database
 * @reutrn, a JSON representation of the object in storage
 */
function get_local_application(){
	return JSON.parse(getfromStorage('application'));
}

/** Function to get the current app state from local database
 * @reutrn, a JSON representation of the object in storage
 */
function get_local_appstate(){
	return JSON.parse(getfromStorage('appstate'));
}

/** Function to get the current states saved for this simulation from local database
 * 
 * @returns
 */
function get_local_states(){
	return JSON.parse(getfromStorage('states'));
}  /*****  ... to line 2413  *****/

/** ** from line 2415 to ... ** 
 * get_local_events retrieves all of the events that have happened on this particular device.
 * These events will be in the form of any of the "get", or "set" or etc. methods covered in the API.
 */
function get_local_events(){
	return JSON.parse(getfromStorage('localevents'));
}

/** Model updaters, getters and removers *******/

/**
 * ----------
 * Model Getters, Setters, and Removers
 * ----------------------------------------
 */

function updateCurrentPartition(new_partition){
	var local_device = get_local_device();
	local_device.current_partition = new_network;
	putinStorage( 'device', JSON.stringify(local_device) );
}


function updateCurrentNetwork(new_network){
	var local_device = get_local_device();
	local_device.current_network = new_network;
	putinStorage( 'device', JSON.stringify(local_device) );
	
}

function updateCurrentSimulation(new_simulation){
	var local_device = get_local_device();
	local_device.current_simulation = new_simulation;
	putinStorage( 'device', JSON.stringify(local_device) );
	
}


function updateRegisteredIn(new_list){
	var local_device = get_local_device();
	local_device.registeredIn = new_list;
	putinStorage( 'device', JSON.stringify(local_device) );
}


function updateLocalEventsToken(token){
	//gets the events
	var local_events = get_local_events();
	//sets the token to the token of the user
	local_events.token = token;
	//returns the new object to the local storage.
	putinStorage( 'localevents', JSON.stringify(local_events) );
}


function updateDeviceName(old_name, new_name){
	var local_device = get_local_device();
	var local_session = get_local_session();
	var partition = getPartitionfromDevice( old_name);
	var network = getNetwork(old_name);
	
	//rename it in the local device
	if(local_device.current_device_name == old_name){ 
		local_device.current_device_name == new_name;
	}
	
	//renae it in config map nested object if necessary
	if(network !== null && partition !== null){
		local_session.config_map[partition][network][new_name] = local_session.config_map[partition][network][old_name]
		delete local_session.config_map[partition][network][old_name];
	}
	
	//rename it in free list object
	var list = local_session.config_map['freelist'];
	if( list.hasOwnProperty(device_name) ){
		local_session.config_map['freelist'][new_name] = local_session.config_map['freelist'][old_name];
		delete local_session.config_map['freelist'][old_name];
	}
	
	
	putinStorage( 'device', JSON.stringify(local_device) );
	putinStorage( 'session', JSON.stringify(local_session) );
	
	//send to event queue
	var params = { 
			'config_map' : local_session.config_map,
			'old_name': old_name, 
			'new_name': new_name,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/update/DeviceName';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	
}

function updateNetworkName(old_name, new_name){
	var local_device = get_local_device();
	var local_session = get_local_session();
	var partition = getPartition(old_name);
	//check if the name is the network name of the current device
	if(local_device.current_network == old_name){
		//if so change it
		local_device.current_network = new_name;
	}
	
	//update in list of networks created
	var list = local_device.networks_created;
	for(var i = 0; i < list.length; i++){
		if( local_device.networks_created[i] == old_name){
			local_device.networks_created[i] = new_name;
		}
	}
	
	//perform the renaming of the network in configuration map
	var temp = local_session.config_map[Partition_name][old_name];
	
	local_session.config_map[Partition_name][new_name] = temp;
	//deletes the network
	delete local_session.config_map[Partition_name][old_name];

	pputinStorage( 'device', JSON.stringify(local_device) );
	putinStorage( 'session', JSON.stringify(local_session) );
	
	//send to event queue
	var params = { 
			'config_map' : local_session.config_map,
			'old_name': old_name, 
			'new_name': new_name,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/update/NetworkName';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
}

function updateSimulationName(old_name, new_name){
	var local_application = get_local_application();
	var local_session = get_local_session();
	var local_device = get_local_device();
	
	
	if( old_name == local_session.simulation_name){
		local_session.simulation_name = new_name;
	}
	var list = local_application.simulation_list;
	//iterate over the list, when we find the current simulation reduce the number of networks by 1
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == old_name){
			local_application.simulation_list[i].name = new_name;
			break;
		}
	}
	
	if(local_device.current_simulation == old_name){
		local_device.current_simulation == new_name;
	}
	
	putinStorage( 'device', JSON.stringify(local_device) );
	putinStorage( 'session', JSON.stringify(local_session) );
	putinStorage( 'application', JSON.stringify(local_application) );
	
	//send to event queue
	var params = { 
			'config_map' : local_session.config_map,
			'old_name': old_name, 
			'new_name': new_name,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/update/SimulationName';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
}

function updateDeviceNumber(new_number){
	var local_session = get_local_session();
	var local_application = get_local_application();
	var sim = local_session.simulation_name;
	local_application.total_devices = new_number;
	local_session.num_devices = new_number;
	var list = local_application.simulation_list;
	
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == sim){
			local_application.simulation_list[i].num_devices = new_number; 
		}
	}
	
	var params = { 
			'config_map' : local_session.config_map,
			'device_number': new_number, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/update/DeviceNumber';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	
	putinStorage( 'application', JSON.stringify(local_application) );
	putinStorage( 'session', JSON.stringify(local_session) );

}

function updateNetworkNumber(new_number){
	var local_session = get_local_session();
	var local_application = get_local_application();
	var sim = local_session.simulation_name;
	local_application.total_networks = new_number;
	local_session.num_networks = new_number;
	var list = local_application.simulation_list;
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == sim){
			local_application.simulation_list[i].num_networks = new_number; 
		}
	}
	var params = { 
			'config_map' : local_session.config_map,
			'network_number': new_number, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/update/NetworkNumber';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	console.log(new_number);
	console.log(local_session);
	putinStorage( 'application', JSON.stringify(local_application) );
	putinStorage( 'session', JSON.stringify(local_session) );
}

function updateLocalCount(){
	var local_device = get_local_device();
	updateUserLocalCount(1);
	updateUserGlobalCount(1);
	 updateSessionGlobalCount(1);
	var params = { 'token' : local_device.token, 'localcount': local_device.localcount, 'current_network' : local_device.current_network };
	params.simulation_name = local_device.current_simulation;
	var method = '/update/LocalCount';
	var timestamp = new Date();
	addToEventQueue(method, params, timestamp);
	
	appDefaultView();
}

function updateUserLocalCount(new_count){
	var local_device = get_local_device();
	local_device.localcount += new_count;
	//console.log(local_device.localcount);
	putinStorage( 'device', JSON.stringify(local_device) );

	
}

function updateUserGlobalCount(new_count){
	var local_device = get_local_device();
	local_device.globalcount += new_count;
	putinStorage( 'device', JSON.stringify(local_device) );
}


function update_config_map(new_map){
	var local_session = get_local_session();
	local_session.config_map = new_map;
	putinStorage( 'session', JSON.stringify(local_session) );
}

function updateSessionGlobalCount(new_count){
	var local_session = get_local_session();
	local_session.globalcount += new_count;
	putinStorage( 'session', JSON.stringify(local_session) );
	
}

function updateSimulationLog(new_comments){
	var local_session = get_local_session();
	local_session.activity_logs += new_comments;
	putinStorage( 'session', JSON.stringify(local_session) );
}

function updateDeviceLog(new_activity){
	local_device = get_local_device();
	local_device.activity += new_activity;
}


function updateTokenMethod( new_method){
	var local_session = get_local_session();
	local_session.tokenMethod = new_method;
	putinStorage( 'session', JSON.stringify(local_session) );
}

function updateAppState(){
	appstate = get_local_appstate();
	appstate.user = get_local_device();
	appstate.current_simulation_session = get_local_session();
	appstate.application = get_local_application();
	putinStorage( 'appstate', JSON.stringify(appstate) );
} /* ** .. to line 2710 ** */




