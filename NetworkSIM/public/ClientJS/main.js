/*****
 * Main.js holds all of the javascript for the client 
 * 
 * Variables:
 * ------------
 * user_data: holds the variables related to the current user
 * session_data: holds the variables related to the current simulation which this 
 *               device is a member of
 * application: holds the variables related to the application
 * app_state: 
 * local_events: holds the events that have occurred on this device since the last contact with the server
 *             after contact with the server, this list is wiped.
 * local_session: The current session of the application on this device, it is stored 
 *              in local storage and updated every time the device synchronises with the 
 *              server.
 * config_map: A variable contained in "local_session", holds the current configuration of the 
 *             simulation, which is made up of the current partitions, the networks within these partitions, 
 *             and the devices within these networks.
 * local_application: ?holds the current application for the device? 
 * local_events: holds all the events that have
 * local_device: holds the data about this user to which these variables are native.
 *****/

/**
 * Initializes the local_events, which will hold all of the events
 * which occur on this device. This list will be sent to the server
 * to be handled and recorded. This is stored in the JSON format.
 */ 
local_events = {};
local_events.eventQueue = [];
local_events.token = '';

/**
 * Function to be executed when the page loads up
 * first set the default side bar view
 * then get the style sheets needed and load out App content 
 */
window.onload = function(){
	defaultsideBarView();
	loadStyleSheet('../css/bootstrap.min.css');
	loadStyleSheet('../css/dashboard.css');
	
	loadAppContent();
	

}

/**
 * set a request to refresh our application with the server every 3 seconds
 * Will be changed later to using websockets with socket.io
 */ 
window.setInterval(function(){
	  /// call our sync function here
		Sync2Server();
	}, 3000);

/**
 * function overwrites the "appstate" array above with new data.
 * The "new_state" object will be an "appstate" as outlined in the JSON API Calls document"
 */
function overWriteAppState(new_state){
	//replaces the current appstate with new_state
	appstate = new_state;  
	console.log(appstate.device);
	//updates the user with the user of the new_state.
	local_device = appstate.device;
	//local session is the current session for this device, stored in local storage
	local_session = appstate.current_simulation_session;
	console.log(local_session.config_map);
	
	//if the current session has a configuration map
	//WHEN WOULD THIS NOT HAPPEN? I guess on initialization?
	if( local_session.config_map !== null ){
		//converts the local_session 
		//CHANGE THIS VARIABLE NAME TO SOMETHING NOT STRING
		var String = local_session.config_map.toString();
		//what are we doing here? If this is a check for something, isn't there a stronger way
		//to do this? Is this checking if it is a JSON object?
		if(String.substr(0,1) == '{'){
			//decodes the local session if it is a JSON object.
			local_session.config_map = JSON.parse(local_session.config_map);
		}
		
	}
	//sets the current application on this device to the new state.
	local_application = appstate.application;
	//places all of the changes into the local storage of the device
	putinStorage( 'appstate', JSON.stringify(appstate) );
	putinStorage( 'session', JSON.stringify(local_session) );
	putinStorage( 'device', JSON.stringify(local_device) );
	putinStorage( 'application', JSON.stringify(local_application) );
}

/**
 * addToEventQueue adds an event to the event queue of this device to be sent to the server.
 * @method: is how the server should handle this event in the form of a URL
 * @params: is the data which accompanies this event
 * @timeStamp: is the time at which this event occurred
 */
function addToEventQueue(method, params, timeStamp){
	
	//gets the list of the events which have occurred on this device since it last contacted the server.
	local_events = get_local_events();
	
	//gets the eventQueue from the local storage.
	var events = local_events.eventQueue;
	//creates the query to the server, this constitutes an event in the event queue
	var query = {'URL': method, 'Body' : params, 'timestamp': timeStamp}
	//adds the event to the event queue
	events.push(query);
	//updates the localEvents to the new list of local events.
	local_events.eventQueue = events;
	local_events.token = getToken();
	
	putinStorage( 'localevents', JSON.stringify(local_events) );
	
}

/**
 * newEventQueue creates an empty event queue.
 */
function newEventQueue(){
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	putinStorage( 'localevents', JSON.stringify(queue) );
	return queue;

}

/***
 * ------------------
 * Domain Logic, handles modeling tokens, networks, and more
 * ------------------
 */

/**
 * addToken updates the current token for this user. If this user 
 * has no token it adds this token to the user.
 * @new_token: a unique string identification for a token.
 */
function addToken(new_token){
	//gets the user information out of local storage
	var local_device = get_local_device();
	//adds the token to the user information
	local_device.token = new_token;
	//saves the user information into the local storage.
	putinStorage( 'device', JSON.stringify(local_device) );
}


/**
 * addNetworkCreated2User adds a network created by this user to the list of networks
 * that this user has created.
 * @new_network: the new network which was created
 * @partition_name: the name of the partition this network belongs to.
 * @simulation_name: the name of the simulation this network belongs to.
 */
function addNetworkCreated2User(new_network, Partition_name, Simulation_name, local_device){
	//pushes the network to the list of networks created by this user
	local_device.networks_created.push(new_network);	
	putinStorage( 'device', JSON.stringify(local_device) );
}

/**
 * addNetworkCreated2Session adds the new network to the list of networks in the current simulation
 * @new_network: the new network which was created
 * @partition_name: the name of the partition this network belongs to.
 * @simulation_name: the name of the simulation this network belongs to.
 */
function addNetworkCreated2Session(new_network, Partition_name, Simulation_name, local_session){
	local_session.num_networks += 1;
	//Ryan would need to specify the simulation to be added to as well.
	local_session.map_config[Partition_name][new_network] = {};
	putinStorage( 'session', JSON.stringify(local_session) );	

}

/**
 * addNetworkCreate2Application updates the total number of networks in the application?
 * why do we want this? Shouldn't the application just query each of its simulations if it needs to know?
 * shouldn't application contain simulations, and then the simulations are updated each time something changes
 * rather than holding these local_session things?
 */
function addNetworkCreated2Application(local_session, local_application){
	var sim = local_session.simulation_name;
	local_application.total_networks += 1;
	var list = local_application.simulation_list;
	for(var i = 0; i < list.length; i++ ){
		if( list[i].name == sim){
			list[i].num_networks += 1; 
		}
	}
	putinStorage( 'application', JSON.stringify(local_application) );
}

/** remove a device from its current network and adds 
 * the same device in the new specified network
 * used only at the local device level
 * @param device_name: the name of the device to add to the network
 * @param network_name: the name of the network to be added to
 * 
 */
function addDevice( device_name, network_name){
	
	removeDevicefromNetwork( device_name, network_name);
	addDevice2Network( device_name, network_name);
	//gets the default page for the user.
	appDefaultView();
}

/**
 * addDevice2Network: adds a device to a network
 * @param device_name: the name of the device to add to the network
 * @param network_name: the name of the network to be added to
 */
function addDevice2Network( device_name, network_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	//gets the information of this user
	var local_device = get_local_device();
	//gets the configuration of the current simulation
	var map = local_session.config_map;
	//gets the partition of the network 
	var Partition_name = getPartition(network_name);
	if( device_name == local_device.current_device_name){
		//updates the network this device belongs to
		updateCurrentNetwork(network_name);

		updateCurrentPartition(Partition_name);
	}
	//add the device to the actual configuration map
	device_num = size(local_session.config_map[Partition_name][network_name]) + 1;
	local_session.config_map[Partition_name][network_name][device_name] = device_num;
	//send the information to the eventQueue for syncing with the server
	var params = { 
			'network_name': network_name, 
			'partition_name': Partition_name , 
			'simulation_name': local_session.simulation_name,
			'device_name' :  device_name
			};
	var url = '/add/Device/Network';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timeStamp);

}


/**
 * addDevice2Network: adds a device to a network
 * @param device_name: the name of the device to add to the network
 * @param network_name: the name of the network to be added to
 */
function addDevice2FreeList( device_name, simulation_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	//gets the information of local device
	var local_device = get_local_device();
	if( device_name == local_device.current_device_name){
		//updates the network this device belongs to
		updateCurrentNetwork('freelist');
		
		//updates the partition this device belongs to. Should be done within "updateNetwork"
		updateCurrentPartition('freelist');
	}
	free_num = size(local_session.config_map.['freelist']) + 1;
	//adds the device to the freelist
	local_session.config_map['freelist'][device_name] = free_num;
	putinStorage( 'session', JSON.stringify(local_session) );
	var params = { 
			'simulation_name': local_session.simulation_name,
			'device_name' :  device_name
			};
	var url = '/add/Device/FreeList';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timeStamp);
	
}


/**
 * addSimulation2Application adds a new simulation to the application
 * @simulation: the new simulation to be added to the application
 */
function addSimulation2Application(simulation){
	//gets the name of the simulation to be added
	var name = simulation.name;
	//gets the number of networks in this simulation
	var num_networks = simulation.num_networks;
	//gets the number of devices in this simulation
	var num_devices = simulation.num_devices;
	//gets the current application on the user's side
	var local_application = get_local_application();
	//creates a new simulation object to push to the array of simulations
	var simulationItem = { 'name' : name, 'num_networks': num_networks, 'num_devices': num_devices};
	//places the new simulation into the simulation list.
	local_application.simulation_list.push(simulationItem);
	putinStorage( 'application', JSON.stringify(local_application) );
	
}

/***
 * Deletion calls
 * ------------------
 */

/**
 * deleteNetwork deletes a network within a partition
 * @network_name: the name of the network to delete
 * @partition_name: the name of the partition in which that network resides
 */
function deleteNetwork(network_name, Partition_name){
	var local_device = get_local_device();
	var local_session = get_local_session();
	//network should only be stored in one object not two
	//should check if the network was created by the user
	
	var list = local_device.networks_created;
	for(var i = 0; i < list.length; i++ ){
		if( list[i] == network_name){
			deleteNetworkFromDevice(network_name, Partition_name);
			break;
		}
	}
	//delete from simulation object
	deleteNetworkFromSession(network_name, Partition_name);
	//delete from application object
	deleteNetworkFromApplication(network_name);
	var params = { 
			'network_name': network_name, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/delete/Network';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timeStamp);
	
	
}

/**
 * deleteNetworkFromDevice deletes a network created by the user.  
 * @param network_name: holds the name of the network to be deleted
 * @param Partition_name
 */
function deleteNetworkFromDevice(network_name, Partition_name){
	//gets the user information
	var local_device = get_local_device();
	//gets the simulation the user is in
	var sim = local_device.current_simulation;
	//gets the list of the networks the user has created
	var networkArray = local_device.networks_created;
	//removes the network from this list
	var networkArray = removeItem(networkArray, network_name);
	local_devices.networks_created = networkArray;
	
	putinStorage( 'device', JSON.stringify(local_device) );
}

/**
 * deleteNetworkFromSession deletes a network from the simulation on the 
 * user's side
 * @param network_name: the name of the network to be deleted
 * @param Partition_name: the name of the partition which the network is in.
 */
function deleteNetworkFromSession(network_name, Partition_name){
	//gets  the current simulation for this user
	var local_session = get_local_session();
	//gets the network object with this name in this partition
	//should check for whether or not these objects exist
	var temp = local_session.config_map[Partition_name][network_name];
	local_session.config_map[Partition_name]['-'] = temp;
	//deletes the network
	delete local_session.config_map[Partition_name][network_name];
	putinStorage( 'session', JSON.stringify(local_session) );
}

/**
 * deleteNetworkFromApplication deletes a network from the application on the 
 * @param network_name: the name of the network to be deleted
 * @param Partition_name: the name of the partition which the network is in.
 */
function deleteNetworkFromApplication(network_name){
	//gets the local session object
	var local_session = get_local_session();
	//get the local application object
	var local_application = get_local_application();
	//reduce the number of networks in the system in the application total networks count
	local_application.total_networks -= 1;
	//get the simulation name of the current session;
	var sim = local_session.simulation_name;
	//get the list of simulations kept in the local_application
	var list = local_application.simulation_list;
	//iterate over the list, when we find the current simulation reduce the number of networks by 1
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == sim){
			local_application.simulation_list[i].num_networks -= 1; 
		}
	}
	//save in the local storage
	putinStorage( 'application', JSON.stringify(local_application) );
	
	
}

/** Function to delete a device from the simulation
 * the device will be removed form the configuration map as well as the application 
 * @param: device_name, the name of the device to be deleted
 */
function deleteDevice(device_name){
	//gets the simulation from storage
	var local_session = get_local_session();
	//gets the current application on the user's side
	var local_application = get_local_application();
	var sim = local_session.simulation_name;
	deleteDeviceFromSession(device_name);
	deleteDeviceFromApplication(device_name);
	var params = { 
			'device_name': device_name, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/delete/Device';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timeStamp);
	
}

/** Function to delete the actual simulation
 * the simulation will be removed from the application and possible from the current session if needed
 * @param: simulation_name, the name of the simulation to be deleted
 */
function deleteSimulation(simulation_name){
	//gets the simulation from storage
	var local_session = get_local_session();
	deleteSimulationFromApplication(simulation_name);
	if( simulation_name == local_session.simulation_name ){
		deleteCurrentSimulation(simulation_name);
	}
	var params = { 
			'simulation_name': local_session.simulation_name,
			};
	
	var url = '/delete/Simulation';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timeStamp);
}

/** Function to delete the actual simulation
 * the simulation will be removed from the application
 * @param: simulation_name, the name of the simulation to be deleted
 */
function deleteSimulationFromApplication(simulation_name){
	//gets the current application on the user's side
	var local_application = get_local_application();
	//get the list of simulations kept in the local_application
	var list = local_application.simulation_list;
	//iterate over the list, when we find the current simulation reduce the number of networks by 1
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == simulation_name){
			local_application.total_networks -= local_application.simulation_list[i].num_networks;
			local_application.total_devices -= local_application.simulation_list[i].num_devices;
			list.splice(i, 1);
			break;
		}
	}
	local_application.simulation_list = list;
	putinStorage( 'application', JSON.stringify(local_application) );
}

/** Function to reset the current simulation object to a blank state
 */
function deleteCurrentSimulation(){
	var local_session = {};
	local_session.num_devices = 0;
	local_session.num_networks = 0;
	local_session.simulation_population = 0;
	local_session.simulation_name = '';
	local_session.config_map = {};
	local_session.tokenMethod = '';
	local_session.globalcount = 0;
	local_session.activity_logs = '';
	putinStorage( 'session', JSON.stringify(local_session) );
	
}

/**
 * deleteDeviceFromSession deletes a network from the simulation on the 
 * user's side
 * @param network_name: the name of the network to be deleted
 * @param Partition_name: the name of the partition which the network is in.
 */
function deleteDeviceFromSession(device_name){
	//gets  the current simulation for this user
	var local_session = get_local_session();
	//gets the network object with this name in this partition
	//should check for whether or not these objects exist
	var list = local_session.config_map['freelist'];
	//if the device can be found in the free list then delete it, otherwise get the partition
	//the device belongs in as well as the network and delete it from the configuration map
	if( list.hasOwnProperty(device_name) ){
		delete local_session.config_map.free_list[device_name];
	}else{
		network = getNetwork( device_name);
		partition = getPartitionfromDevice( device_name);
		delete local_session.config_map[partition][network][device_name];
	}
	putinStorage( 'session', JSON.stringify(local_session) );
}

/**
 * deleteDeviceFromApplication deletes a network from the application on the 
 * @param network_name: the name of the network to be deleted
 * @param Partition_name: the name of the partition which the network is in.
 */
function deleteDeviceFromApplication(device_name){
	//gets the local session object
	var local_session = get_local_session();
	//get the local application object
	var local_application = get_local_application();
	//reduce the number of networks in the system in the application total networks count
	local_application.total_devices -= 1;
	//get the simulation name of the current session;
	var sim = local_session.simulation_name;
	//get the list of simulations kept in the local_application
	var list = local_application.simulation_list;
	//iterate over the list, when we find the current simulation reduce the number of networks by 1
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == sim){
			local_application.simulation_list[i].num_devices -= 1;
			break;
		}
	}
	//save in the local storage
	putinStorage( 'application', JSON.stringify(local_application) );
	
	
}
/**
 * removeDevicefromNetwork removes a device from a network in the session.
 * @param device_name
 * @param network
 */
function removeDevicefromNetwork( device_name, network){
	//gets the user from storage
	var local_device = get_local_device;
	//gets the simulation from storage
	var local_session = get_local_session();
	//gets the partition which the user is part of
	partition = getPartitionfromDevice( device_name);
	//deletes the device from the network
	delete local_session.config_map[partition][network][device_name];
	//updates the locally stored object
	putinStorage( 'session', JSON.stringify(local_session) );
	var params = { 
			'network_name': network, 
			'partition_name': partition , 
			'simulation_name': local_session.simulation_name,
			'device_name' :  device_name
			};
	var url = '/remove/Device/Network';
	var timestamp = new Date();
	addToEventQueue(url, params, timeStamp);
}

/**
 * removeDevicefromFreeList: remove a device from the freelist
 * @param device_name: the name of the device to removed from the free list
 */
function removeDevicefromFreeList( device_name, simulation_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	//removes a device form the free list
	var list = local_session.config_map['freelist'];
	if( list.hasOwnProperty(device_name) ){
		delete local_session.config_map['freelist'][device_name]
	}
	putinStorage( 'session', JSON.stringify(local_session) );
	
	var params = { 
			'simulation_name': local_session.simulation_name,
			'device_name' :  device_name
			};
	var url = '/remove/Device/FreeList';
	var timestamp = new Date();
	addToEventQueue(url, params, timeStamp);
	
}

/**
 * Segment a partition into one made of two partitions
 * @param: network, the network to be assigned its own partition
 * @param: partition, the old partition the network was in to be added
 */
function dividePartition(network, partition){
	var local_session = get_local_session();
	delete local_session.config_map[partiton][network];
	local_session.config_map[network] = network;
	console.log(local_session.config_map);
	putinStorage( 'session', JSON.stringify(local_session) );
	
	var params = { 
			'network': network_name, 
			'partition_name': network_name , 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/divide/Partition';
	var timestamp = new Date();
	addToEventQueue(url, params, timeStamp);
}
 

/**
 * resetEventQueue sets the event queue to be empty
 */
function resetEventQueue(){
	local_events = get_local_events();
	local_events.eventQueue = [];
	putinStorage( 'localevents', JSON.stringify(local_events) );
}

/**
 * Object Creation
 * --------------
 */

/**
 * createNetwork creates a new network in this simulation.
 * @param network_name: the name of the network to be added
 * 
 * NOTE: this is not how it should work now that we have partitions working
 * differently. The user should create a network and partition as a pair, then 
 * this partition can be connected to other partitions to create bigger paritions
 * 
 * Note: Now fixed to create it in doubles if made by an admin or within an existing 
 * partition if made by a device
 */
function createNetwork(network_name){
	//gets the user information from storage
	var local_device = get_local_device();
	var local_session = get_local_session();
	var local_application = get_local_application();
	var partition = network_name;
	//gets the current partition that the user is in
	
	sim = local_device.current_simulation;
	//only add it to the user's list of networks created if the session is in device view
	if(local_device.verified == true){
		partition = local_device.current_partition;
		addNetworkCreated2User(network_name, partition, sim, local_device);
	}
	addNetworkCreated2Session(network_name, partition, sim, local_session);
	addNetworkCreated2Application(local_session, local_application);
	
	var params = { 
			'token', local_device.token,
			'network_name': network_name, 
			'partition_name': partition , 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/create/Network';
	var timestamp = new Date();
	addToEventQueue(url, params, timeStamp);
	//add to eventQueue
	//render Application View
	
}

function createDevice(device_name){
	var local_session = get_local_session();
	var local_application = get_local_application();
	local_application.total_devices += 1;
	local_session.num_devices += 1;
	var list = local_application.simulation_list;
	addDevice2FreeList( device_name, local_session.name);
	for(var i = 0; i < list.length; i++ ){
		if( local_application.simulation_list[i].name == sim){
			local_application.simulation_list[i].num_devices += 1; 
		}
	}
	
	var params = { 
			'device_name': device_name, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/create/Device';
	var timestamp = new Date();
	addToEventQueue(url, params, timeStamp);
	
	
}

var create_simulation = {};

/**
 * CreateSimulation creates a new simulation in the application.
 */
function CreateSimulation(){
	//creates a new simulation object
	var body = wrapCreateSimulation();
	//the method to tell the server how to handle it
	var url = "/add/Simulation";
	//gets the timestamp of the simulation creation
	var timestamp = new Date();
	//adds the simulation to the application
	addSimulation2Application(body);
	//adds the creation of the simulation to the event queue
	addToEventQueue(url, body, timestamp);
	//sets the view of the user to the lists of simulations 
	simulationListView();
	
}

/**
 * Create a partition made of of two partitions
 * @param: partitiona, the first partition
 * @param: partitionb, the new partition to be added
 */
function mergePartition(partition_a, partition_b){
	var local_session = get_local_session();
	delete local_session.config_map[partition_b];
	local_session.config_map[partition_a] = merge_objects(config_map[partition_a],config_map[partition_b]);
	console.log(local_session.config_map[partition_a]);
	putinStorage( 'session', JSON.stringify(local_session) );
	
	var params = { 
			'partition_a': partition_a, 
			'partition_b' : partition_b,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/merge/Partitions';
	var timestamp = new Date();
	addToEventQueue(url, params, timeStamp);
}
 

/**
 * Token Authentication
 * ------------------------
 */

/**
 * authenticate verifies that a token code input by a user is valid
 */
function authenticate(){
	//gets the token from the html
	var input = document.getElementsByName('tokenvalue')[0];
	var token = input.value;
	//sends the token to be verified
	authToken(token);
	
}

/**
 * authToken sends a token to the server to be authenticated
 * @token: a token code given by the user
 */
function authToken(token){
	//sets the body of the message to the server to be the token
	var body = {'token': token};
	params = JSON.stringify(body);
	//sets the method by which the server handles the call. 
	var url = "/authenticate/authToken";
	//adds the event to the event queue
	updateLocalEventsToken(token);
	//sends the token to be validated by the server
	send2Server(url, params, validate_user);
	
}

/**
 * validate_user verifies whether the token input by the user is valid or not
 * @param data is the data received from the server
 * 
 * NOTE: if the token is invalid this should be displayed on the page rather than
 * in an alert
 */
function validate_user(data){
	object = data;
	//if the authentication was a success
	if(object.Response == 'Success'){
		alert('You have been authenicated. \nPlease wait to be redirected');
		//sync with the server and redirect to the simulation
		Sync2Server();
			
	}
	else{
		alert('Token invalid \nPlease enter the correct token for this simulation')
	}
}

/**
 * Getter Methods
 * -----------------
 */

function getSimulation(simulation_name){
	var param = {
			'simulation_name': simulation_name,
			'client_id' : ''
			};
	params = JSON.stringify(param);
	var url = '/get/Simulation';
	//sends the request to be validated by the server
	send2Server(url, params, render);
}

/**
 * getPartitions returns the list of partitions for this current simulation
 */
function getPartitions(){
	//gets the current simulation on the user side
	var local_session = get_local_session();
	//gets the configuration of this simulation
	var map = local_session.config_map;
	//holds a list of the partitions
	var list = [];
	for(var partition in map){
		list.push(partition);
	}
	//returns a list of partitions
	return list;
}

/**
 * getNetworks retrieves a list of networks in the simulation
 */
function getNetworks(){
	//gets the local simulation
	var local_session = get_local_session();
	//gets the configuration map of the current simulation on the users side
	var map = local_session.config_map;
	// a list of all of the networks in the simulation
	var list = []; 
	//populates list
	for (var partition in map){
		for (var network in map[partition]){
			list.push(network);
		}
	}
	return list;
}

/**
 * getDevices returns all of the devices in the current state of the simulation on this users side
 */
function getDevices(){
	//gets the current simulation on the users side
	var local_session = get_local_session();
	//gets the list of networks
	var networklist = getNetworks();
	//list will hold all of the devices in the simulation
	var list = [];
	for( var i = 0; i < networklist.length; i++){
		var devicelist = getDevices(networklist[i]);
		list.push.apply(list, devicelist);
	}
	
	return list;
}

/**
 * getDevices get all the devices within a particular network
 * @param network_name: the name of the network to get all the devices from within
 */
function getDevices(network_name){
	//gets the current simulation as the user sees it
	var local_session = get_local_session();
	//gets the configuration of this simulation
	var map = local_session.config_map;
	//gets the partition that the user is located in 
	partition = getPartition(network_name)
	//list to hold all of the devices within this particular network
	var list = [];
	for(var key in map[partition][network_name]){
		list.push(key);
	}
	return list;
}

/**
 * getLogs returns the activity logs for the current simulation on this device
 */
function getLogs(){
	var local_session = get_local_session();
	var map = local_session.config_map;
	return local_session.activity_logs;
}

/**
 * getNetwork gets the name of the network which a device is a member of 
 * @param device_name
 */
function getNetwork(device_name){
	var local_session = get_local_session();
	var map = local_session.config_map;
	//gets the list of networks
	var list = getNetworks();
	//holds the name of the network that this device is present in
	//we should handle the case when the device cannot be found in any of these networks
	var Network_name = '';
	for( var key in map ){
		for( var network in map[key]){
			if(map[key][network][device_name] !== null){
			
				Network_name = network;
			}
		}
	}
	//returns the name of the network that this device is in
	return Network_name;
}

/**
 * getToken gets the token associated with this particular user
 */
function getToken(){
	var local_device = get_local_device();
	return local_device.token;
}

/**
 * getVerified returns whether or not this particular user is verified or not
 * for this simulation.
 */
function getVerified(){
	var local_device = get_local_device();
	
	console.log(local_device.verified);
	return local_device.verified;
}

/**
 * getPartition gets the partition containing a certain network.
 * @param network_name
 */
function getPartition(network_name){
	var local_session = get_local_session();
	var map = local_session.config_map;
	//holds the name of the partition that this network is in
	var Partition_name = '';
	for( var key in map ){
		for( var network in map[key]){
			if (network == network_name){
				var Partition_name = key;
			}
		}
	}
	return Partition_name;
}

function getPartitionfromDevice( device_name){
	network_name =  getNetwork(device_name);
	return getPartition(network_name);
}

/**
 * getLoginView
 * I'm not entirely sure, I believe it gets the page for logging in and out
 */
function getLoginView(){
	 clearPageElements();
	
}



/**
 * Utilities for user interaction
 * ------------------------------
 */

/** Function for turning a url and params object into the desired activity log
 * Can be used by any function to return the necessary activity associated with the URL
 * Ideally will be used on the client and server
 *@param, url : the method identifier 
 *@param body : the body containing the information required for building the activity
 */
function generateActivity(url, body, timestamp){
	switch(url) {
		case '/create/Simulation':  // should this be create/Simulation ?
			var new_activity = "Simulation created " +  body.simulation_name + " at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/add/Device/Network':
			var new_activity = "Device " +  body.device_name +  " added to network " + body.network_name + " at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/add/Device/FreeList':
			var new_activity = "Device" +  body.device_name +  " added to the free area " + " at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/create/Network' :
			var new_activity = "Network " +  body.network_name +  " was created  at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/create/Device' :
			var new_activity = "Device " +  body.device_name +  " was created  at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/merge/Partitions' :
			var new_activity = "Two Partitions, " +  body.partition_a +  " and "  + body.partition_b + " were merged on " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/remove/Device' :
			var new_activity = "Device " +  body.device_name +  " was removed from Network "  + body.network_name +  " at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/remove/Device/FreeList'
			var new_activity = "Device " +  body.device_name +  " was removed from the Free area at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/delete/Device':
			var new_activity = "Device " +  body.device_name +  " was deleted " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/delete/Network' :
			var new_activity = "Network " +  body.network_name +  " was deleted at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/delete/Token' :
			var new_activity = "Token " +  body.token +  " was deleted and deactivated at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/delete/Partition':
			var new_activity = "Partition" +  body.partition_name +  " was removed from the simulation at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case '/delete/Simulation' :
			var new_activity = "Simulation " +  body.simulation_name +  " was removed the application at " + timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case '/update/LocalCount':
			var new_activity = "Updated Counter to " +  body.localcount + " At " + timestamp + "\n";
			updateDeviceLog(new_activity);
			//add to activity log for the simulation
			new_activity = local_device.current_device_name + " " + new_activity;
			updateSimulationLog(new_activity);
			break;	
		
		case '/update/NetworkName':
			var new_activity = "Network " +  body.old_name +  " was assigned new name " + body.new_name + " at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case '/update/DeviceName':
			var new_activity = "Device " +  body.old_name +  " was assigned new name " + body.new_name + " at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case '/update/SimulationName':
			var new_activity = "Simulation " +  body.old_name +  " was assigned new name " + body.new_name + " at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case '/update/TokenMethod':
			var new_activity = "Device token propagation method  has been updated to  " + body.new_method + " at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/update/DeviceNumber':
			var new_activity = "Number of devices in simulation increased to " +  body.device_number + " at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case '/update/NetworkNumber':
			var new_activity = "Number of networks in simulation increased to " +  body.network_number + " at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
			
		case '/update/ConfigMap':
			var new_activity = "The configuration map of the simulation was updated at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		
		case 'dividePartition':
			var new_activity = "Network " +  body.network_name +  " was split into its own partition at " +  timestamp + "\n";
			updateSimulationLog(new_activity);
			break;
		default:
			break;
		
	}	
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * from stackoverflow
 * @param obj1
 * @param obj2
 * @returns obj1 based on obj1 and obj2
 */
function merge_objects(obj1,obj2){
    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    return obj1;
}

/**
 * logout handles logging out of the server for administrators
 * Not done yet
 */
function logout(){
	//need to check how this works
	clearStorage();
	clearPageElements();
	
}


/**
 * removeItem removes an item from an array
 * @param array: the array to remove items from
 * @param item: the item to remove from the array
 * 
 * NOTE: should handle the case when the item is not in the array
 */
function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
            }
    }
    return array;
}

/**
 * notAuthorized displays the text to the user that they are not 
 * authorized.
 */
function notAuthorized() {
	var str = "<error> <h3> Sorry you are not authorized </h3>" +
			"</error>";
	return str;
	
}


function size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
/**
 * Local Storage Interaction
 * ----------------------------
 */

/**
 * getfromStorage gets an item from the local storage on the device by id
 * @param id: the key of the element to retrieve from local storage
 */
function getfromStorage(id){
	return sessionStorage.getItem(id);
	
}

/**
 * putinStorage puts an item into local storage under a key
 * @param id: the key under which to store the item in local storage
 * @param item: the item to store in local storage
 */
function putinStorage(id, item){
	if( id !== null && item !== null){
		sessionStorage.setItem(id, item);
	}
	
}

/**
 * not really sure what this does
 */
function getAllStorage(){
	var i = 0, map = {}, sKey;
	for (; sKey = window.localStorage.key(i); i++) {
		map[sKey] = window.localStorage.getItem(sKey);
	}
	return map;
}
/**
 * Not really sure what this does either
 * @param list
 */
function putListStorage(list){
	var i = 0, sKey;
	for (var key in list) {
		putinStorage(key, list[key]);
	}
}

/**
 * clears the local storage
 */
function clearStorage(){
    localStorage.clear();
    sessionStorage.clear();
}

/**
 * --------------
 * Page Rendering
 * -----------------------------
 */


/**
 * clearPageElements clears all the elements on the page by setting 
 * their inner html to empty.
 */
function clearPageElements(){
	 clearFooter();
	 clearHeader();
	 clearNav();
	 clearSideBar();
	 clearContainer();
	 clearSection();
}

/**
 * clearFooter clears the footer on the page 
 */
function clearFooter(){
	var w =document.getElementsByTagName("footer")[0];
	w.innerHTML = '';
}

/**
 * clearNav clears the navigation bar on the page 
 */
function clearNav(){
	var y = document.getElementsByTagName("nav")[0];
	y.innerHTML = '';
}

/**
 * clearSideBar clears the side bar on the page 
 */
function clearSideBar(){
	var a = document.getElementsByTagName("aside")[0];
	a.innerHTML = '';
}

/**
 * clearHeader clears the header on the page 
 */
function clearHeader(){
	var z = document.getElementsByTagName("header")[0];
	z.innerHTML = '';
	
}

/**
 * clearContainer clears the container on the page 
 */
function clearContainer(){
	var a = document.getElementById("content");
	a.innerHTML = '';
	
}

/**
 * clearFooter clears the section on the page 
 */
function clearSection(){
	var y = document.getElementsByTagName("section")[0];
	y.innerHTML = '';
}

/**
 * Get Html Elements
 * ----------------------
 */

/**
 * getFooter gets the information within footer
 */
function getFooter(){
	var w =document.getElementsByTagName("footer")[0];
	return w;
}

/**
 * getHeader gets the information within header
 */
function getHeader(){
	var x = document.getElementsByTagName("header")[0];
	return x;
}

/**
 * getSidebar gets the information within the sidebar
 */
function getSideBar(){
	var y = document.getElementsByTagName("aside")[0];
	return y;
}

/**
 * getSection gets the information within section
 */
function getSection(){
	var y = document.getElementsByTagName("section")[0];
	return y;
}

/**
 * getContainer gets the information within the container
 */
function getContainer(){
	var a = document.getElementById("content");
	//console.log(a);
	return a;
	
}

/**
 * Views, what is shown to the user
 * ---------------------------------
 */

/**
 * not really sure what this does, I'll leave it to you olanre
 * @param timeout
 */
function updateAllViews( timeout){
	setTimeout(function() {
		simulationListView();
	}, timeout);
	
	setTimeout(function() {
		AccountView();
	}, timeout);
	
	setTimeout(function() {
		appDefaultView();
	}, timeout);
		
}

/**
 * loadStyleSheet loads a css style sheet to the page
 * @param src: the stylesheet to load to the page (I believe)
 */
function loadStyleSheet(src){
    if (document.createStyleSheet) document.createStyleSheet(src);
    else {
        var stylesheet = document.createElement('link');
        stylesheet.href = src;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
}
//Here all the different pages are stored in different scripts 
//labeled "template[n]" in the html file.

/**
 * newSimulationView changes the view to the page where simulation
 * can be created.
 */
function newSimulationView(){
	//gets the html for template10
	var simulation_view = document.getElementById('template10');
	var html = simulation_view.innerHTML;
	var content = getContainer();
	//sets the page's html to template 10
	content.innerHTML = html;
}
/**
 * createNetworkView changes the view to the page where a new network may
 * be created
 */
function createNetworkView(){
	var network_view = document.getElementById('template1');
	var html = network_view.innerHTML;
	var content = getSection();
	content.innerHTML = html;
}

/**
 * defaultsideBarView sets the sidebar to look like template5
 * located in the javascript of index.html
 */
function defaultsideBarView(){
	var sidebar = document.getElementById('template5');
	var aside = getSideBar();
	html = sidebar.innerHTML;
	aside.innerHTML = html;
	//console.log(html);	
}

/**
 * defaultheaderView sets the header of the page to 
 * template 6
 */
function defaultheaderView(){
	var header = document.getElementById('template6');
	var head= getHeader();
	head.innerHTML = header.innerHTML;
	
}

/**
 * simulationSideBarView  sets the sidebar to the sidebar 
 * for when viewing simulations, which is template 9
 */
function simulationSideBarView(){
	var sidebar = document.getElementById('template9');
	var aside = getSideBar();
	aside.innerHTML = sidebar.innerHTML;
	
}

/**
 * appDefaultView gets the front page of the application.
 */
function appDefaultView(){
	defaultheaderView();
	//console.log(getVerified());
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
		//AccountView();
	}else{
		var app = viewDeviceView();
		var content = getContainer();
		content.innerHTML = app;
		simulationSideBarView();
		
	}
}
/**
* Actual HTML Application view without the iterators or local and global count
 */
function appView(){
	return document.getElementById('template7').innerHTML;
	
}


/**
 * Function to render the simulation list view 
 * First clear the naviation, footer and Section elements
 * Then render the view from the provided template. Populating the Template with the list
 * of simulations from the local application simulation list
 */
function simulationListView(){
	//sets the header view
	defaultheaderView(); 
	//clears everything on the page
	clearNav();
	clearFooter();
	clearSection();
	//gets the local application and the local session
	var local_application = get_local_application();
	var local_simulation_list = get_local_session();
	defaultheaderView();
	
	//gets the list of simulations
	var simulations = local_application.simulation_list;
	//adds the list of simulations into the page
	var html =  SimulationListTemplate(simulations);
	//gets the container of the page
	var content = getContainer();
	//sets the default sidebar page
	defaultsideBarView();

	content.innerHTML = html;
}

/**
 * RegisterView changes the view of the page to the registration
 * page, which is template 8.
 */
function RegisterView(){
	var html = document.getElementById('template8').innerHTML;
	var content = getContainer();
	content.innerHTML = html;
}

/**
 * AccountView changes the view of the page to the information 
 * about that user's account.
 */
function AccountView(){
	var html = AccountTemplate();
	var content = getContainer();
	content.innerHTML = html;
}

/**
  * THe view to display the number of networks in a given simulation
 * the list of networks of obtained from the configuration map
 * then view is then rendered using the template and the list provided.
 */
function NetworksListView(){
	var lists = getNetworks();
	console.log(lists);
	var html = NetworksListTemplate(lists);
	getSection().innerHTML = html;
}

/** The view for displaying the number of devices in a network. 
* First the number of networks is obtained, then the number of 
* devices within each network is calculate and rendered using the device template
* the final table is entered into the section element
 */
function DeviceListView(){
	var netlist = getNetworks();
	
	var html = "<div class = 'container'> " +
	"<table>";
	for(var i = 0; i < netlist.length; i ++ ){
		var devices = getDevices(netlist[i]);
		
		html += DevicesListTemplate(devices);
	}
	html += "</table>" +
	"</div><br>";
	getSection().innerHTML = html;
}

/**
 * changes the page view to the logs of this user.
 */
function LogsView(){
	var logs = getLogs();
	var html = SimulationLogsTemplate(logs);
	var footer = getFooter();
	footer.innerHTML = html;
}

/**
 * loadAppContent loads the content from a sync to the server
 */
function loadAppContent(){
	Sync2Server();	
	updateAllViews(400);
	
}


/**
 * Template for rendering the device view
 * this function obtains the values needed from the local_device and session
 * and populated them in the html code to generate the template
 * @return str,  the html string that has been created with the information
 * ----------------
 */
function viewDeviceView(){
	var local_device = get_local_device();
	var local_session = get_local_session();
	//console.log(local_device);
	var app_name = local_device.current_simulation;
	
	var str = "<div>" +
				"<h2> Hello " + local_device.current_device_name + " in " + local_device.current_simulation + "</h2>" +
				"<h3> You are now in " +  local_device.current_network + " " +
						" <br> There are " + local_session.simulation_population + " other devices  in this simulation</h2>" +
			"</div> " +
			"<div class = 'container'>" +
				"<div class = 'appinterface'>" + appView() + "</div>" +
			"<div class = 'counters'> <table border='1'>" +
			
			" <tr> " +
				"<td> <span class = 'text'> Local Counter </span> </td> " +
				"<td id = 'local_count'> " + local_device.localcount + "</td>" +
			" </tr> " +
			" <tr> " +
				"<td>  <span class = 'text'> Global Counter </span> </td> " +
				" <td id = 'global_count'>  " + local_session.globalcount + "</td> " +
			"</tr> " +
		" </table> " +
	"</div> " +
"</div>";
	return str;
	
}

/** Template for generating the information pertaining a a user's account
 * contains information about the account from the local_device data
 * @returns str, the generated html string for the template
 */
function AccountTemplate(){
	var local_device = get_local_device();
	var str = "<div>" +
		"<h2> Hello " + local_device.current_device_name + " in " + local_device.current_simulation + "</h2>" +
		"</div> " +
			"<div class = 'container'>" +
				"<div class = 'appinterface'> You Email: " + local_device.email + "</div>" +
"<div class = 'counters'> <table>" +
	"<tr> <td> " +
		 "<div> RegistedOn: " +  local_device.registeredOn + "  </div> " +
	"</td> "+
" </tr> " +
"<tr> <td> " +
"<div> Token: " +  local_device.token + "  </div> " +
"</td> "+
" </tr> " +
"<tr> <td> " +
"<div> Current Partition: " +  local_device.current_partition + "  </div> " +
"</td> "+
"</tr> " +
"<tr> <td> " +
"<div> Current Network: " +  local_device.current_network + "  </div> " +
"</td> "+
" </tr> " +
" </table> " +
"</div> " +
"</div>";
	return str;
}

/**
 * Function to generate the list of all networks in the system,
 * the user also has the option to join any network. If the network was created
 * by the device, that template gives a button for deleting the network. 
 * @param networks, the provided list of networks
 * @returns str, the html string generated from the networks
 */
function NetworksListTemplate(networks){
	var local_device = get_local_device();
	var local_device = get_local_device();
	var sim = local_device.current_simulation;
	var networks_created = local_device.networks_created;
	var str = "<table>";

		for(var i = 0; i< networks.length; i++){
			
			str += "<tr  id = '" + networks[i] + "'>" +
					" <td> " + networks[i] + "   " +
				//+ "<td> <div onclick = 'addDevice2Network(\'" + local_device.current_device_name + "\', \'" + networks[i] + "') '> " +
						"Join Network </td> </tr>";
			for(var j = 0; j < networks_created.length; j++){
				if( networks[i] == networks_created[j] ){
					str +=  "<td> <div onclick = 'deleteNetwork(\'" + networks_created[i] + "\', \'" + local_device.current_partition + "\')> " +
					"Join Network </div> </td> </tr>";
				}
			}
		}
		str += "</table>" +
			"";
		//console.log(str);
		return str;
}

/** 
 * Function to give the list of devices within the current simulation in
 * a rendered html format. This function specifies the template of the layout
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function DevicesListTemplate(devices){
	//console.log(devices);
		str = "";
		for(var i = 0; i< devices.length; i++){
			str += "<tr  id = '" + devices[i] + "'> <td> " + devices[i] + "  </td> </tr>";
		}
		
		return str;
}

/**
 * SimulationLogsTemplate template for viewing the logs of this 
 * simulation
 * @param logs: The list of logs for this simulation.
 */
function SimulationLogsTemplate(logs){
	var str = "<div class = 'logs'> " + logs + "</div>";
		return str;
}



/**
 * Function to generate an html render to the list of simuations in the application
 * Each item should display the simulation name, number of devices and number of networks
 * If a user is part of a simulation they have the option to view the simulation, otherwise they will
 * be allowed to register in it. 
 * @param simulations, the simulation list map
 * @returns str, the rendered html
 */
function SimulationListTemplate(simulations){
	var local_device = get_local_device();
	var str = "<div class = 'simulations_management'> ";
	str += " <table id = 'simslist'> ";
	for (var i =0 ; i < simulations.length; i++) {
		 str += "	<tr> " + "<td> <div class = 'sim-name'>  " + simulations[i].name + " </div> </td> " +
			  "<td> <div class = 'num-devices'> Number of Devices: " + simulations[i].total_devices+ " </div> </td> " +
			  "<td> <div class = 'num-networks'> Number of Networks: " + simulations[i].total_networks+ " </div> </td> ";
		 		
		 if(local_device.current_simulation == simulations[i].name ){
			 str += "<td> <div class = 'aButton' onclick = 'appDefaultView()'> View </div> </td> </tr>";
		 }else{
			 str += "<td> <divclass = 'aButton' onclick = 'RegisterView()' > Register  </div> </td> </tr>";
		 }
	}	
	str +=  " </table> 	</div>";
	return str;
}

/** 
 * Function to render the new state based on new data provided by out server
 * First it checks if the new data is not null
 * If the two JSON objects representing our application state are the same then the old state is kept
 * Otherwise te new state is written into the system. 
 * @param new_data, new JSON object representing our application state
 */
function render(new_data){
	var old_state = get_local_appstate();
	if(new_data !== null && new_data.appstate !== null){
		if( JSON.stringify(old_state) === JSON.stringify(new_data) ){
			//overwrite the app state with the old state as they are the same
			//actually, could we just leave everything as is?
			overWriteAppState(old_state);
		}else{
			//otherwise if the old and new states are not the same
			//update the old state with the new state
			alert('New changes detected on server');
			console.log(new_data);
			overWriteAppState(new_data);
			//update all of the views.
			updateAllViews(400);
		}
		
	}else{
		//if recieved an empty response
		alert('Something went wrong. Please try again');
	}
	

/**
 * Helper function to remove an element from its parent
 * @param element, the element to be removed
 * @param element
 */
function removeElement(element){
	element.parentNode.removeChild(element);
}

/**
 * insertAfter inserts as a child of the parent "reference node" in a tree.
 * @param newNode: the new node to be inserted
 * @param referenceNode: the parent node 
 */
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//holds the number of networks
var netnumbers = 0;
//holds the number of devices
var devicenumbers = 0;
//holds the number of available left to fill
var avail_networks = 0;
//holds the number of devices availablle to fill
var avail_devices = 0;
 

/**
 * expandField expands the section to allow you to add networks and devices
 * @param selector: the field in which to expand (ie devices, networks, etc)
 */
function expandField(selector){
	var number; 
	if (selector.name == 'netnumbers'){
		number = selector.value;
		netnumbers = number;
		
	}
	if( selector.name == 'devicenumbers'){
		number = selector.value;
		devicenumbers = number;
	}
	if( netnumbers > 0 && devicenumbers > 0){
		generateConfigTable();
	}
	
}

function checkField(elem){
	if(elem.value == null){
		alert('Please enter a value!');
	}
}

/**
 * generateConfigTable creates the table for which to configurate
 * a new simulation.
 */
function generateConfigTable(){
	
	avail_networks = netnumbers;
	avail_devices = devicenumbers;
	document.getElementById('avail-devices').innerHTML = avail_devices;
	document.getElementById('avail-networks').innerHTML = avail_networks;
	if( avail_devices >0 && avail_networks > 0 ){
		var add_buttons = document.getElementsByClassName('partition-adder');
		enableButtons(add_buttons);
	}
	
	
}

/**
 * updateavailableField updates the available number of devices
 * and networks.
 */
function updateavailableField(){
	document.getElementById('avail-devices').innerHTML = avail_devices;
	document.getElementById('avail-networks').innerHTML = avail_networks;
}
/**
 * addtoConfigTable inserts a new element in to
 * @param insert_point
 * @param name: variable stating what is being added to the config table
 * @param element: 
 * @returns {Boolean}
 */
function addtoConfigTable(insert_point, name, element){
	if( insert_point == null || element == null) return false;
	var html = '';
	element.disabled = false;
	var div = createTrElement();
	switch(name){
		case 'Network':
			if( avail_networks > 0){
				avail_networks -= 1;
				avail_devices -= 1;
				html = generateNetworkTable();
				
			}else{
				element.disabled = true;
			}
			break;
		case 'Device':
			
			if( avail_devices >0 ){
				html = generateDeviceClass();
				avail_devices -= 1;
			}else{
				element.disabled = true;
			}
			
			break;
		case 'Partition':
			if( avail_devices >0 && avail_networks > 0 ){
				html = generatePartitionTable();
				avail_networks -= 1;
				avail_devices -= 1;
			}else{
				element.disabled = true;
			}
			
			break;
		default:
				
	}
	if( div !== null){
		div.innerHTML = html;
		parent_of_insert = insert_point.parentNode;
		parent_of_insert.insertBefore(div, insert_point);
	}
	updateavailableField();	
}

/**
 * registerNewEmail creates a location on the page to enter a new 
 * email to be registered with the server
 * @param e: not sure what e is
 * @param insert_point: The point in the DOM tree at which to enter the element
 */
function registerNewEmail(e, insert_point){

	var email = document.getElementById('new_email').value;
	var newemail = "<td> <input type = 'checkbox' name = 'email[]' value = '" + email + "'> " + email + " </td> ";
		
	var dummyelement = createTrElement();
	dummyelement.innerHTML = newemail;
	parent_of_insert = insert_point.parentNode;
	parent_of_insert.insertBefore(dummyelement, insert_point);
	var email = document.getElementById('new_email').value = '';

	
}

/**
 * deletefromConfigTable delete a field from the table. 
 * @param delete_point
 * @param name: what kind of field we are deleting from the table
 * @param map
 * @returns {Boolean}
 */
function deletefromConfigTable(delete_point, name, map){
	if( delete_point == null || map == null) return false;
	var html;
	element = document.getElementById(map);
	switch(name){
		case 'Network':
			avail_networks += 1;
			removeDevices( delete_point);
			if( avail_networks > 0){
				var add_buttons = element.getElementsByClassName('net-adder');
				enableButtons(add_buttons);
			}
			break;
		case 'Device':
			avail_devices += 1;
			if( avail_devices >0 ){
				var add_buttons = element.getElementsByClassName('device-adder');
				enableButtons(add_buttons);
			}
			break;
		case 'Partition':
			removeNetworks( delete_point);
			if( avail_devices >0 && avail_networks > 0 ){
				var add_buttons = element.getElementsByClassName('partition-adder');
				enableButtons(add_buttons);
			}
			break;
		default:
					
	}
	parent_of_delete = delete_point.parentNode;
	parent_of_delete.removeChild(delete_point);
	updateavailableField();
}

/** Function to remove devices from the configuration table
 * @param element: the element to be removed.
 */
function removeDevices( element){
	var allDevices = element.getElementsByClassName('device');
	//console.log(allDevices.length);
	for(var i = 0; i < allDevices.length; i++){
		//console.log('Removing Device');
		avail_devices += 1;
	}
}

/** Function to remove a network from the configuration table
 * @param element: the node cluster to be removed
 */
function removeNetworks( element){
	//console.log(element);
	var allNetworks = element.getElementsByClassName('network');
	for(var i = 0; i < allNetworks.length; i++){
		deletefromConfigTable(allNetworks[i].parentNode.parentNode, 'Network', 'config-map')
	}
}

/** function to enable a list of buttons
 * @param buttons_array, the list of button elements to be enabled
 */
function enableButtons( buttons_array){
	for(var i = 0; i < buttons_array.length; i++){
		buttons_array[i].disabled = false;
	}
	
}
/**
 * create an html tr element floating in the html.
 */
function createTrElement(){
	var mydiv = document.createElement('tr');
	return mydiv
	
}

/**
 * create a div element floating in the html.
 */
function createDivElement(){
	var mydiv = document.createElement('div');
	return mydiv
	
}

/**
 * generatePartitionTable returns an html table to contain the partitions from the templates
 */
function generatePartitionTable(){
	var table = document.getElementById('template2');
	return table.innerHTML;
	
}

/**
 * generateNetworkTable returns an html table to contain from the templates
 * the list of networks
 */
function generateNetworkTable(){
	var network_section = document.getElementById('template3');
	return network_section.innerHTML;
	
}
 
/** Function to get the device section form the templates
 *	@return, the inner html of the template
 */
function generateDeviceClass(){
	var device_section = document.getElementById('template4');
	return device_section.innerHTML;
	
}

/** Function to get the great grand parent of the starting node
 * @param, start_point, the starting point node
 */
function getGreatGrandParentElement(start_point){
	return start_point.parentNode.parentNode.parentNode;
	
}

/** function to get the grand parent of a starting node
 * @param, start_point, the starting point node
 */
function getGrandParentElement(start_point){
	return start_point.parentNode.parentNode;
	
}

/** Function to get all the partition input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return partiton_elements, the DOM list of input fields.
 */
function getAllPartitionsInputField(){
	var config_map = document.getElementById('config-map');
	var partition_elements = config_map.getElementsByClassName('partition');
	return partition_elements;
}

/** Function to get all the network input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return network_elements, the DOM list of input fields.
 */
function getAllNetworksInputField(partition){
	var network_elements = partition.getElementsByClassName('network');
	return network_elements;
}

/** Function to get all the device input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return device_elements, the DOM list of input fields.
 */
function getAllDevicesInputField(network){
	var device_elements = network.getElementsByClassName('device');
	return device_elements;
}



/**Function to allow someone to view the emailing list already saved in the system.
 * THe list is then presented in a checkbox for the user to enter. The section will ideally be a part of a form.
 * 
 * @param list, the list of email address or phone numbers
 * @returns str, the formatted html string
 */
function adminShowEmailList(list) {
	var str;
	for(var i = 0; i< list.length; i++){
		str += "<td> <input type = 'checkbox' name = 'email[]' value = '" + list[0] + "'> " + list[0] + " </td> ";
	}
	return str;	
	
} 

/**********************		Server side function calling as a backup ************************/


function Sync2Server(){
	var url = '/getSync';
	var param = '';
	local_events = get_local_events();
	if(local_events == null){
		params =  JSON.stringify(newEventQueue());	
	}else{
		
		var params = JSON.stringify(local_events);
	}	
	send2Server(url, params, render);
	console.log(params);
	
}


/**
 * Ajax section for javascript
 * Bundles all of the event data and sends it to the server to handle.
 */
send2Server = function(url, params, callback)
{
	
	//optional list
	//console.log(params);
    var request = new XMLHttpRequest();
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    	
		request=new XMLHttpRequest();
		
	}else{// code for IE6, IE5
		
    	request=new ActiveXObject("Microsoft.XMLHTTP");
    	
    }
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200)
        {
        	resetEventQueue();
        	var obj = JSON.parse(request.responseText);
        	//console.log(obj);
            callback(obj); // Another callback here
        }else{
        	//alert("Please wait")
        	
        }
    }; 
    request.open('POST', url);
    request.send(params);
}


var incr = 0;
function generateConfigMap(level, start_element){
	switch(level){
		case 1:
			var partitions = getAllPartitionsInputField();
			var simulation_map = '{';	
			for (var i = 0; i < partitions.length; i++){
				var partition_name = partitions[i].value;
				start_element = getGrandParentElement(partitions[i]);
				if( i == partitions.length - 1){
					simulation_map +=  '"' + partition_name + '": {' + generateConfigMap(2, start_element) + '}';
				}else{
					simulation_map +=  '"' + partition_name + '": {' + generateConfigMap(2, start_element) + '},';
				}
			}
			return simulation_map + '}' ;
			break;
		case 2:
			var networks = getAllNetworksInputField(start_element);
			var simulation_map = '';	
			for (var i = 0; i < networks.length; i++){
				var network_name = networks[i].value;
				simulation_map  += '"' + network_name + '" : {';
				start_element = getGrandParentElement(networks[i]);
				if( i == networks.length - 1){
					simulation_map +=  generateConfigMap(3, start_element) + '} ';
				}else{
					simulation_map +=  generateConfigMap(3, start_element) + '}, ';
				}
				
				 
			}
			return simulation_map;
			break;
		case 3:
			var devices = getAllDevicesInputField(start_element);
			var simulation_map = '';		
			for (var i = 0; i < devices.length; i++){
				incr += 1;	
				var device_name = devices[i].value;
				if( i == devices.length - 1){
					simulation_map +=  '"' + device_name + '": ' + incr  ;
				}else{
					simulation_map +=  '"' + device_name + '": ' + incr  + ',' ;
				}
			}
			return simulation_map;
			break;
	}
	
}



function wrapCreateSimulation() {
	var simulation_name = document.getElementById('simulation_name').value;
	var num_devices = document.getElementById('num_devices').value;
	var num_networks = document.getElementById('num_networks').value;
	var tokenMethod = document.getElementById('tokenmethod').value;
	var config_div = document.getElementById('config-map');
	var string = generateConfigMap(1, 'config-map');
	
	create_simulation.num_devices = parseInt(num_devices);
	create_simulation.num_networks = parseInt(num_networks);
	create_simulation.simulation_population = 0;
	create_simulation.simulation_name = simulation_name;
	create_simulation.globalcount = 0;
	create_simulation.tokenMethod = tokenMethod;
	create_simulation.config_map = JSON.parse(string);
	create_simulation.activity_logs = '';
	
	console.log(create_simulation);
	return create_simulation;
}


/********* Model Modifiers ***************************/

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

/**
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
	//gets the user data associated with this device
	var local_device = get_local_device();
	//sets the token to the token of the user
	local_events.token = local_device.token;
	//returns the new object to the local storage.
	putinStorage( 'localevents', JSON.stringify(local_events) );
}


function updateDeviceName(new_name){
	var local_device = get_local_device();
	var old_name = local_device.current_device_name;
	local_device.current_device_name = new_name;
	putinStorage( 'device', JSON.stringify(local_device) );
	//send to event queue
}

function updateNetworkName(old_name, new_name){
	var local_device = get_local_device();
	var local_session = get_local_session();
	var partition = getPartition(old_name);
	//perform the renaming of the network
	var temp = local_session.config_map[Partition_name][old_name];
	
	local_session.config_map[Partition_name][new_name] = temp;
	//deletes the network
	delete local_session.config_map[Partition_name][old_name];

	putinStorage( 'session', JSON.stringify(local_session) );
	//send to event queue
}

function updateDeviceNumber(new_number){
	

}

function updateNetworkNumber(new_number){
	
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
}
 
