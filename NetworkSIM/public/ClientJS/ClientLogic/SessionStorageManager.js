/**
 * getfromStorage gets an item from the local storage on the device by id
 * @param id: the key of the element to retrieve from local storage
 */
function getFromStorage(id){
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
 * clears the local storage
 */
function clearStorage(){
    localStorage.clear();
    sessionStorage.clear();
}


/************************************************************
 * 					Getters
 * ************************************************************
 */

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
function get_local_simulation_names(){
	return JSON.parse(getfromStorage('simulation_names'));
}


/** Function to get the current states saved for this simulation from local database
 * 
 * @returns
 */
function get_local_states(){
	return JSON.parse(getfromStorage('simulation_states'));
} 

/**
 * get_local_events retrieves all of the events that have happened on this particular device.
 * These events will be in the form of any of the "get", or "set" or etc. methods covered in the API.
 */
function get_local_events(){
	return JSON.parse(getfromStorage('localevents'));
}

var appstate = {
		device{ }
		simulation{}
		simulation_names{}
		
}

/**********************************************************
 * 				Modifiers
 * *****************************************************
 */

/**
 * overwrites the previous simulation with the new simulation
 */
function store_local_simulation(new_simulation){
	putinStorage( 'simulation', JSON.stringify(new_simulation));
}

function store_local_device(new_device){
	putinStorage( 'device', JSON.stringify(new_device));
}

function store_local_simulation_names(new_simulation_names){
	putinStorage( 'simulation_names', JSON.stringify(new_simulation_names));
}

function store_local_simulation_states(new_simulation_states){
	putinStorage( 'simulation_states', JSON.stringify(new_simulation_states));
}

function store_local_events(new_events){
	putinStorage( 'localevents', JSON.stringify(new_events));
}

