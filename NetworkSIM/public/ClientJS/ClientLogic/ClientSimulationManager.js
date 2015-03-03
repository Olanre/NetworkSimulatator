/**
 * CreateSimulation creates a new simulation in the application.
 */
function CreateSimulation(){
	//creates a new simulation object
	var body = wrapCreateSimulation();
	//the method to tell the server how to handle it
	var url = "/create/Simulation";
	//gets the timestamp of the simulation creation
	var timestamp = new Date();
	//adds the creation of the simulation to the event queue
	addToEventQueue(url, body, timestamp);
	//sets the view of the user to the lists of simulations 
	simulationListView();
	
}

/** Function to delete the actual simulation
 * the simulation will be removed from the application and possible from the current session if needed
 * @param: simulation_name, the name of the simulation to be deleted
 */
function deleteSimulation(simulation_name){
	//gets the simulation from storage
	var local_session = get_local_session();
	if(local_session !== null){
		var params = { 
				'partition_list' : local_session.partition_list,
				'simulation_name': local_session.simulation_name,
				};
		
		var url = '/delete/Simulation';
		var timestamp = new Date();
		//add to the event queue to sync with server
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("local_session does not exist");
	}
}

/**
 * Getter Methods
 * -----------------
 */

/**
 * Function to get a new simulation from the server
 * 
 */
function getSimulation(simulation_name){
	var param = {
			'simulation_name': simulation_name,
			};
	params = JSON.stringify(param);
	var url = '/get/Simulation';
	//sends the request to be validated by the server
	send2Server(url, params, render);
}

/**
 * Function to get the states associates from a simulation 
 * @param simulation_name
 */
function getSimulationState(simulation_name){
	var param = {
			'simulation_name': simulation_name,
			};
	params = JSON.stringify(param);
	var url = '/get/States';
	//sends the request to be validated by the server
	send2Server(url, params, render);
}


var incr = 0;
/** Generates the config map from UI elements
 * 
 * @param level, the starting recursive level
 * @param start_element, the starting HTML element
 * @returns {String}, the rendered JSON stringified config map
 */
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


/**
 * Wraps values and generates the config map and other data required for creating a simulation
 * @returns create_simulation, the new simulation object created
 */
function wrapCreateSimulation() {
	var simulation_name = document.getElementById('simulation_name').value;
	var num_devices = document.getElementById('num_devices').value;
	var num_networks = document.getElementById('num_networks').value;
	var tokenMethod = document.getElementById('tokenmethod').value;
	var config_div = document.getElementById('config-map');
	var string = generateConfigMap(1, 'config-map');
	var create_simulation = {};
	create_simulation.num_devices = parseInt(num_devices);
	create_simulation.num_networks = parseInt(num_networks);
	create_simulation.simulation_population = 0;
	create_simulation.simulation_name = simulation_name;
	create_simulation.globalcount = 0;
	create_simulation.tokenMethod = tokenMethod;
	create_simulation.config_map = JSON.parse(string);
	create_simulation.config_map['freelist'] = {};
	create_simulation.activity_logs = '';
	
	console.log(create_simulation);
	return create_simulation;
}