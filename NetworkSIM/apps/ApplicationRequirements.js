/**
 * New node file
 */

var socket = io.connect();

var connected = false;



function manipulateRDT(rdtName, method){
	var local_device = get_local_device();
	var simulation = get_local_simulation();
	var token = local_device.token;
	var device_id = local_device._id;
	var timestamp = new Date();
	var route = '/manipulate/RDT';
	var event_data = {'name' : rdtName, 'method' : method, 'device_id' : token, 'simulation_id' : simulation._id};
	
	var event = {'event_data' : event_data, 'timestamp' : timestamp, 'token' : token, 'simulation_id' : simulation._id};
	event = JSON.stringify(event);
	
	socket.emit(route, event );
}

socket.on('newRDTVal', function(data){
	newRDTVal(data['new_val']);
});

/**
 * getFromStorage gets an item from the local storage on the device by id
 * @param id: the key of the element to retrieve from local storage
 */
function getFromStorage(id){
	return sessionStorage.getItem(id);
}

/**
 * get the device for this user from the local storage
 */
function get_local_device(){
	return JSON.parse(getFromStorage('device'));
}

/** 
 * Gets the list of all the names of simulations from local storage
 */
function get_local_simulation(){
	return JSON.parse(getFromStorage('simulation'));
}
