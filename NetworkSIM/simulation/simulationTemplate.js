/**
 * New node file
 */

/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */


exports.getSimulation = function getSimulation(){
	var session_data = {};
	session_data.deviceList = [];
	session_data.networkList = [];
	session_data.partitionList = [];
	session_data.simulation_population = 0;
	session_data.simulation_name = '';
	session_data.config_map = {};
	session_data.tokenMethod = '';
	session_data.globalcount = 0;
	session_data.activity_logs = '';
	return session_data;
}

exports.addNetwork = function addNetwork(networkName, partition, networkType, simulation ){
	var application = applicationTemplate;
	Database.getSimByName(simulation, function(Sim){
		var new_number = Sim.networkList.length + 1;
		Sim.config_map[partition][networkName] = {};
		application.updateNetworkNumber(new_number);
		var Network = networkTemplate.getTemplate();
		Sim.networkList.push(Network);
		Database.modifySimByName(simulation, Sim);
		//need to update number of networks in the application and simulation here

	});
	
	
}

exports.addDevice = function addDevice(deviceName, simulationName){
	var d = new Date();
	var Device = deviceTemplate.getDevice();
	Device.current_simulation = simulationName;
	Device.registeredOn = d.toString();
	Device.current_device_name = deviceName;
	Device.current_partition = 'freelist';
	Device.email = deviceName;
	Database.addUser(Device);
	Database.getSimByName(simulationName, function(Sim){
		Sim.deviceList.push(Device);
		Database.modifySimByName(simulationName, Sim);
		//need to update number of devices here for application and simulation
		
	});
}

exports.removeDevice = function addDevice(device_name, network_name, partition_name,  simulationName){
	Database.getSimByName(simulationName, function(Sim){
		var list = Sim.config_map['freelist'];
		if( list.hasOwnProperty(device_name) ){
			delete Sim.config_map['freelist'][device_name];
		}else{
			delete Sim.config_map[partition][network][device_name];
		}
		//need to update number of devices here for application and simulation
		Database.modifySimByName(simulationName, Sim);
	});
	
	
}

exports.removeNetwork = function removeNetwork(network_name, partition_name, simulationName){
	Database.getSimByName(simulationName, function(Sim){
		var temp = Sim.config_map[partition_name][network_name];
		Sim.config_map[partition_name]['-'] = temp;
		//deletes the network
		delete Sim.config_map[partition_name][network_name];
		//var Application = applicationTemplate.updateNetworkNumber()
		Database.modifySimByName(simulationName, Sim);
		//not implemented yet
		Database.getUsersByNetwork( network_name, function(Devices){
			for(var i = 0; i  < Devices.length; i++){
				add2FreeList( Devices[i].current_device_name, simulationName);
			}
			//need to update number of networks in the application and simulation here
		});
		
	});
}

exports.addPartition = function addPartition(partitionName, simulation){
	var partition = partitionTemplate.getPartition();
	partition.partition_name = partitionName;
	Database.getSimByName(simulation, function(Sim){
		Sim.partitionList.push(partition);
		Database.modifySimByName(simulation, Sim);
	});
}

exports.createSimulation = function createSimulation( SimObject ){
	Database.addSim(SimObject);
	
}

exports.deleteSimulation = function deleteSimulation(simulation_name){
	//andrew had not yet made this function
	Database.deleteSim(simulation_name);
	Database.getUsersBySim( simulation_name, function(Devices){
		for(var i = 0; i  < Devices.length; i++){
			//not yet implemented
			Database.deleteUser(Devices[i]);
		}
		
	});
}

exports.updateTokenMethod = function updateTokenMethod(simulation, new_method){
	Database.getSimByName(simulation, function(Sim){
		Sim.tokenMethod = new_method;
		Database.modifySimByName(simulation, Sim);
		
	});
}

exports.save = function save(){
	Database.modifySimulationByName(this.session_data);
}