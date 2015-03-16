/**
 * New node file
 */
function viewApp(app_name){
	var local_simulation = get_local_simulation();
	var applications = local_simulation.applications;
	console.log(applications);
	
}

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
		
		if(apps[i]._id == app_id){
			var location = "../apps/"+apps[i].name + "/" + apps[i].main;
			ViewApp(location);
			
				
		}
		
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}