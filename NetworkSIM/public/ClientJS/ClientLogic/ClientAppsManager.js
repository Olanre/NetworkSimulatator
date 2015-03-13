/**
 * New node file
 */
function viewApp(app_name){
	var local_simulation = get_local_simulation();
	var applications = local_simulation.applications;
	
}

function deployApp(app_name){
	var local_simulation = get_local_simulation();
	if(local_simuation!==null){
		var params = { 
				'app_name': app_name, 
				'simulation_id': local_simulation._id,
				};
		var url = '/get/AppSpec';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}