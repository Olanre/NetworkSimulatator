/**
 * New node file
 */
/***
 * This module is responsible for server-related actions and calls.
 * Please note that the routing javascript code is located under
 * the routes folder within src.
 * @Author: Noah
 * @editedBy Ryan (Jan. 30)
 */

var express = require('express');
var app = express();
var path = require('path');
var logger = require('express-logger');
var fs = require('fs');

var SimulationManager = require("../Server//SimulationManager.js");
//var Database = require("./Database/mongooseConnect.js");

var globalCount = 0;
var port = 3332;  // declare port here so changes to the port are reflected in code below
				 // must be on port 3332 on excalibur for the grader
var server = require("http").Server(app);
var io = require("socket.io")(server);
var clients = [];
var client_map = {};
var connection_map = {};
var Files = {};

function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
}

var handleClient = function (socket) {
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
    
    socket.on("/getSync", sync);

    socket.on("/authenticate/authToken", authToken );
    
    
};

function sync(data){
	
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
}

function authToken(data){
	var json = JSON.parse(data);
	var token = json.token;
	var simulation_id = json.simulation_id;
	SimulationManager.authToken(token, simulation_id, function(obj){
	//for now allow empty tokens
		console.log(obj);
		response.send(obj);
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

 

io.on("connection", handleClient);

server.listen(3000, function(){
	  console.log('listening on *:3000');
	});

app.get('/', function(request,response){
	response.sendFile("./index.html", {"root": __dirname});	
}); 

app.get('/index', function(request,response){
	response.sendFile("./index.html", {"root": __dirname});
	
}); 

app.use(express.static(path.join(__dirname, 'public')));


app.use("/css",  express.static(__dirname + '../public/stylesheets'));
app.use("/logic", express.static(__dirname + '../public/ClientJS/ClientLogic'));
app.use("/template", express.static(__dirname + '../public/ClientJS/HTML_Templates'));
app.use("/view", express.static(__dirname + '../public/ClientJS/Views'));
app.use("/gui", express.static(__dirname + '../public/ClientJS/GUI'));
app.use("/js",  express.static(__dirname + '../public/ClientJS'));
app.use("/img",  express.static(__dirname + '../public/img'));


/* does this get moved into the createSimulation.js module too? */


 
//exports.globalCount = globalCount;  // use globalCount in other modules under routes/
