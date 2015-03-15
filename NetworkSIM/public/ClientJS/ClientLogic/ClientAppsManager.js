/**
 * New node file
 */
function viewApp(app_name){
	var local_simulation = get_local_simulation();
	var applications = local_simulation.applications;
	console.log(applications);
	
}

function DeployApp(app_name){
	var local_simulation = get_local_simulation();
	if(local_simuation!==null){
		var params = { 
				'app_name': app_name, 
				'simulation_id': local_simulation._id,
				};
		var url = '/deploy/App';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}

function  LaunchApp(app_name){
	var local_simulation = get_local_simulation();
	if(local_simuation!==null){
		var params = { 
				'app_name': app_name, 
				'simulation_id': local_simulation._id,
				};
		var url = '/launch/App';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}