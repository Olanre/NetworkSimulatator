function createNetwork(network_name){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var params = { 
				'network_name': network_name, 
				'simulation_id': local_simulation._id,
				};
		var url = '/create/Network';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
		
	}
	else{
		console.log("createNetwork recieved null parameters");
	}
}

function Device_makeNetwork(element){
	var input = document.getElementById(element);
	if(input !== null ){
		var name = input.value;
		if(name !== ''){
			createNetwork(name);
			deviceDefaultView();
		}
	}
	
}


