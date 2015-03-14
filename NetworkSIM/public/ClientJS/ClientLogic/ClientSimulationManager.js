/**
 * CreateSimulation creates a new simulation in the application.
 */
function CreateSimulation(){
	if(checkParametersWereEntered()){
		//deactivates the button
		document.getElementById('button-create-simulation').onclick=null;
		var body = wrapCreateSimulation();
		var url = "/create/Simulation";
		var timestamp = new Date();
		addToEventQueue(url, body, timestamp);
		setTimeout( function(){ simulationListView(); }
		, 1000 );
	}
	else{
		alert("Please enter all parameters correctly");
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

/**
 * Function to get a new simulation from the server
 */
function getSimulation(simulation_id){
	var param = {
			'token' :  getLocalDeviceToken(),
			'simulation_id': simulation_id,
			};
	params = JSON.stringify(param);
	var url = '/get/Simulation';
	//sends the request to be validated by the server
	socket.emit(url, params);
}

/**
 * Function to get the states associates from a simulation 
 */
function getSimulationHistory(simulation_id){
	console.log(simulation_id);
	var param = {
			'token' :  getLocalDeviceToken(), 
			'simulation_id': simulation_id,
			};
	params = JSON.stringify(param);
	var url = '/get/History';
	//sends the request to be validated by the server
	socket.emit(url, params);
	setTimeout( function(){ eventLogsView(); }
	, 1000 );
	
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

//checks if the parameters to creating a simulation were input correctly.
function checkParametersWereEntered(){
	var num_devices=document.getElementById('num_devices').value;
	var simulation_name=document.getElementById('simulation_name').value;
	var num_networks=document.getElementById('num_networks').value;
	var token_method=document.getElementById('tokenmethod').value;
	if(isInt(num_devices)&&num_devices!==null&&num_devices!==''&&isInt(num_networks)&&num_networks!==null&&num_networks!==''&&
			simulation_name!==null&&simulation_name!==''&&token_method!==''&&token_method!==null){
		return true;
	}
	else{
		return false;
	}
}