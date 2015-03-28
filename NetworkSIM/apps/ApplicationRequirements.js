/**
 * New node file
 */

var socket = io.connect();

var connected = false;


function manipulateRDT(rdtName, method, fntoCall){
	var local_device = get_local_device();
	var simulation = get_local_simulation();
	console.log(simulation);
	var token = local_device.token;
	var timestamp = new Date();
	var route = '/manipulate/RDT';
	console.log(rdtName);
	var event_data = {'name' : rdtName, 'method' : method, 'device_id' : token, 'simulation_id' : simulation._id};
	
	var event = {'event_data' : event_data, 'timestamp' : timestamp, 'token' : token, 'simulation_id' : simulation._id};
	event = JSON.stringify(event);
	
	socket.emit(route, event, fntoCall );
}

socket.on('newRDTVal', function(data, fntoCall){
	fntoCall(data['new_val'], data['rdt_name']);
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
