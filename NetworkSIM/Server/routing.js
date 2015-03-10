var SimulationManager = require("./SimulationManager.js");
var io = {};

var clients = [];
var client_map = {};

function injectIO(object){
	io = object;
}

function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
}


function handleClient (socket) {
	//console.log(socket);
	var tweet = {user: "nodesource", text: "Hello, world!"};
	var id = generateUID();
    // to make things interesting, have it send every second
	console.info('New client connected (id=' + socket.id + ').');
	client_map[id] = socket.id;
	io.to(socket.id).emit('session_start', id);

    socket.on("disconnect", function () {
    	 var index = clients.indexOf(socket);
         if (index !== -1) {
             clients.splice(index, 1);
             console.info('Client gone (id=' + socket.id + ').');
         }
    });
    
    socket.on("/getSync", function(data){    		
    		var json = JSON.parse(data);
    		var token = json.token;
    		var events = json.eventQueue ;
    		var simulation= json.simulation_id;
    		console.log(simulation);
    		SimulationManager.authToken(token, simulation, function(obj){
    			//for now allow empty tokens
    			if(obj.Response == 'Success'){
    				console.log("Successful authenication" );
    					handleEventQueue(token, events, function(){
    					console.log(simulation);
    					var state = SimulationManager.getAppStateForDevice(token,simulation);
    					io.to(socket.id).emit('syncState', state);
    				});
    				
    			}else{
    				handleEventQueue(token, events, function(){
    					console.log("Failed authentication");
    					
    					var state= SimulationManager.getBlankAppState();
    					
    					io.to(socket.id).emit('syncState', state);
    					
    				});
    			}
    			
    		});
    });

    socket.on("/authenticate/authToken", function (data){
    	
    	var json = JSON.parse(data);
    	var token = json.token;
    	var simulation_id = json.simulation_id;
    	SimulationManager.authToken(token, simulation_id, function(obj){
    	//for now allow empty tokens
    		console.log(obj);
    		io.to(socket.id).emit('validate_user', obj);
    	});
    } );
    
    
};




function handleEventQueue(token, eventQueue, callback) {
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].route) {


			case '/create/Simulation': 
				SimulationManager.createSimulation(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			case '/create/Network' :
				SimulationManager.createNetwork( eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;		

			case '/create/Device' :
					SimulationManager.createDevice(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			case '/move/Device/Network':
					SimulationManager.addDeviceToNetwork(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			case '/merge/Partitions' :
				SimulationManager.mergePartitions(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;
			
			case '/divide/Partition':
				SimulationManager.dividePartition(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			default:
				break;
				
		}	
	}
	
	
	if (typeof(callback) == "function") {
		callback();
	}
};

module.exports.injectIO = injectIO;
module.exports.handleClient = handleClient;