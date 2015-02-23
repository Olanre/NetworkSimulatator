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
	var application = applicationTemplate.getApplication();
	Database.getSimByName(simulation, function(Sim){
		var new_number = Sim.networkList.length + 1;
		Sim.config_map[partition][networkName] = {};
		application.updateNetworkNumber(new_number);
		var Network = =networkTemplate.getTemplate();
		Sim.networkList.push(Network);
		Database.modifySimByName(simulation, Sim);
		
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
		
	});
}

exports.removeDevice = function addDevice(deviceName, simulationName){

	
}

export.removeNetwork = function removeNetwork(network_name, partition_name, simulationName){
	Database.getSimByName(simulationName, function(Sim){
		var temp = Sim.config_map[partition_name][network_name];
		Sim.config_map[partition_name]['-'] = temp;
		//deletes the network
		delete Sim.config_map[partition_name][network_name];
		Database.modifySimByName(simulationName, Sim);
		//not implemented yet
		Database.getUsersByNetwork( network_name, function(Devices){
			for(var i = 0; i  < Devices.length; i++){
				add2FreeList( Devices[i].current_device_name, simulationName);
			}
			
		});
		
	});
}

exports.addPartition = function addPartition(partitionName, simulation){
	var 
	var Partition = partitionTemplate.getPartition();
	partition.partition_name = partitionName;
	Database.getSimByName(simulation, function(Sim){
		Sim.partitionList.push(Partition);
		Database.modifySimByName(simulation, Sim);
	});
}

export.createSimulation = function createSimulation( SimObject ){
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

exports.save = function save(){
	Database.modifySimulationByName(this.session_data);
}

module.exports.getSimulationTemplate = getSimulationTemplate;