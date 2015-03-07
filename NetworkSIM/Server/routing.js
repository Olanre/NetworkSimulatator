var SimulationManager = require("./SimulationManager.js");

function sync(request, response){
	var data = '';
	
	//waits until all of the data from the client has been received
	request.on("data", function(chunk){
		data += chunk.toString();
	});
	
	//once we have the entire data from the client
	request.on("end", function() {
		var json = JSON.parse(data);
		var token = json.token;
		var events = json.eventQueue ;
		var simulation= json.simulationId;
		//console.log(obj);
		SimulationManager.authToken(token, simulation, function(obj){
			//for now allow empty tokens
			if(obj.Response == 'Success'){
				//console.log("Successful authenication" );
					handleEventQueue(token, events, function(){

					response.send(SimulationManager.getAppStateForDevice(token,simulation));
				});
				
			}

			else{
				handleEventQueue(token, events, function(){

					var state={};
					state.simulation= {};
					state.device= {};
					state.simulation_names=SimulationManager.getSimulationNames();
					response.send(state);
					
				});
			}
			
		});
	});
}

function authToken(request, response){
	var data = '';
	
	//waits until all of the data from the client has been received
	request.on("data", function(chunk){
		data += chunk.toString();
	});
	
	//once we have the entire data from the client
	request.on("end", function() {
		var json = JSON.parse(data);
		var token = json.token;
		var simulation_id = json.simulation_id;
		SimulationManager.authToken(token, simulation_id, function(obj){
		//for now allow empty tokens
			console.log(obj);
			response.send(obj);
		});
	});
}

function handleEventQueue(token, eventQueue, callback) {
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].route) {


			case '/create/Simulation': 
				SimulationManager.createSimulation(eventQueue[i].event_data);
				break;

			case '/create/Network' :
				SimulationManager.createNetwork( eventQueue[i].event_data);
				break;		

			case '/create/Device' :
					SimulationManager.createDevice(eventQueue[i].event_data);
				break;

			case '/move/Device/Network':
					SimulationManager.addDeviceToNetwork(eventQueue[i].event_data);
				break;

			case '/merge/Partitions' :
				SimulationManager.mergePartitions(eventQueue[i].event_data);
				break;
			
			case '/divide/Partition':
				SimulationManager.dividePartition(eventQueue[i].event_data);
				break;

			default:
				break;
				
		}	
	}
	
	
	if (typeof(callback) == "function") {
		callback();
	}
};

module.exports.sync=sync;
module.exports.authToken = authToken;