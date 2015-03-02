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
	return JSON.parse(getfromStorage('simulation'));
}

/** Function to get the current application from local database
 * @reutrn, a JSON representation of the object in storage
 */
function get_local_application(){
	return JSON.parse(getfromStorage('simulation_names'));
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
	return JSON.parse(getfromStorage('simulation_states'));
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



function updateDeviceName(old_name, new_name){
	var local_device = get_local_device();
	var local_session = get_local_session();

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





