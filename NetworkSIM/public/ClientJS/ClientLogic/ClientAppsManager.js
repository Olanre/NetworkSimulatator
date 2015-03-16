/**
 * New node file
 */


function DeployApp(app_id){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		var params = { 
				'app_id': app_id, 
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

function  LaunchApp(app_id){
	var local_simulation = get_local_simulation();
	var apps = local_simulation.apps;
	
	if(local_simulation!==null){
		var params = { 
				'app_id': app_id, 
				'simulation_id': local_simulation._id,
				};
		var url = '/launch/App';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
		
		ViewApp(app_id);
		
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}