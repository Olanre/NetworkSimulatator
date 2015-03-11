/**
 * New node file
 */
exports.getStateTemplate = function getState(){
	var states_data = {};
	states_data.id = '';
	states_data.states = [];
	return states_data;
}

exports.generateActivity = function generateActivity(simulation, url, event_data, timestamp){
	switch(url) {
	case '/create/Simulation': 
		var new_activity = "Simulation created " +  event_data.simulation_name + " at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/add/Device/Network':
		var new_activity = "Device " +  event_data.device_name +  " added to network " + event_data.network_name + " at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/add/Device/FreeList':
		var new_activity = "Device" +  event_data.device_name +  " added to the free area " + " at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/create/Network' :
		var new_activity = "Network " +  event_data.network_name +  " was created  at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/create/Device' :
		var new_activity = "Device " +  event_data.device_name +  " was created  at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/merge/Partitions' :
		var new_activity = "Two Partitions, " +  event_data.partition_a +  " and "  + event_data.partition_b + " were merged on " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/remove/Device' :
		var new_activity = "Device " +  event_data.device_name +  " was removed from Network "  + event_data.network_name +  " at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/remove/Device/FreeList':
		var new_activity = "Device " +  event_data.device_name +  " was removed from the Free area at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/delete/Device':
		var new_activity = "Device " +  event_data.device_name +  " was deleted " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/delete/Network' :
		var new_activity = "Network " +  event_data.network_name +  " was deleted at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/delete/Token' :
		var new_activity = "Token " +  event_data.token +  " was deleted and deactivated at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/delete/Partition':
		var new_activity = "Partition" +  event_data.partition_name +  " was removed from the simulation at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	
	case '/delete/Simulation' :
		var new_activity = "Simulation " +  event_data.simulation_name +  " was removed the application at " + timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	
	case '/update/LocalCount':
		var new_activity = "Updated Counter to " +  event_data.localcount + " At " + timestamp + "\n";
		updateDeviceLog(new_activity, simulation , event_data.token );
		//add to activity log for the simulation
		new_activity = event_data.token + " " + new_activity;
		updateSimulationLog(new_activity, simulation);
		break;	
	
	case '/update/NetworkName':
		var new_activity = "Network " +  event_data.old_name +  " was assigned new name " + event_data.new_name + " at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	
	case '/update/DeviceName':
		var new_activity = "Device " +  event_data.old_name +  " was assigned new name " + event_data.new_name + " at " +  timestamp + "\n";
		updateSimulationLog(new_activity,simulation);
		break;
	
	case '/update/SimulationName':
		var new_activity = "Simulation " +  event_data.old_name +  " was assigned new name " + event_data.new_name + " at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	
	case '/update/TokenMethod':
		var new_activity = "Device token propagation method  has been updated to  " + event_data.new_method + " at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/update/DeviceNumber':
		var new_activity = "Number of devices in simulation increased to " +  event_data.device_number + " at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	
	case '/update/NetworkNumber':
		var new_activity = "Number of networks in simulation increased to " +  event_data.network_number + " at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
		
	case '/update/ConfigMap':
		var new_activity = "The configuration map of the simulation was updated at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	
	case 'dividePartition':
		var new_activity = "Network " +  event_data.network_name +  " was split into its own partition at " +  timestamp + "\n";
		updateSimulationLog(new_activity, simulation);
		break;
	default:
		break;
	
}	

exports.updateDeviceLog = function updateDeviceLog(new_activity, simulation, token){
	Database.getUserbyToken(token, function(Device){
		Device.activity += new_activity;
		Database.modifyUserbyToken(token, Device);
	});
}
	
exports.updateSimulationLog = function updateSimulationLog(new_activity, simulation){
	Database.getSimByName(simulation, function(Sim){
		Sim.activity_logs += new_activity;
		Database.modifySimByName(simulation, Sim);
	});
	}
}
