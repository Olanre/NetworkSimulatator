/****
 * This module is responsible for server-related actions and calls.
 * Please note that the routing javascript code is located under
 * the routes folder within src.
 * @Author: Noah
 ****/

var express = require('express');
var path = require('path');
var logger = require('express-logger');
var eventHandler = require("./EventHandler.js");
var SimulationManager = require('./simulation/SimulationManager');
var Database = require("./Database/mongooseConnect.js");

/****
var Add = require('./routes/Add');
var Create = require('./routes/Create');
var Delete = require('./routes/Delete');
var Update = require('./routes/Update');
var start = require('./routes/start');
var Get = require('./routes/Get');
****/
var Authenticate = require('./routes/Authenticate');


var app = express();
var globalCount = 0;
var port = 3332;  // must be on port 3332 on excalibur for the grader


var server = app.listen(port, function () { 

	var Application = {};

	
Database.getApp(function(data){
	if(data == null){
		Application.simulation_list = [];
		Application.total_devices = 0;
		Application.total_networks = 0;
		Application.super_admin = {};
		Database.addApp(Application);
	}
	else{
		console.log('App already exists');
		}
	});
  var host = server.address().address;
  console.log('Server listening at http://%s:%s', host, port);

  //Here is where we should insert code for loading Simulations from the database
  //We must add them to SimulationManager.simulationList

});



app.use(logger({path: "./logfile.txt"}));


/* does this get moved into the createSimulation.js module too? */
	
app.post("/getSync", function(req, res) {
	var data = '';
	
	//waits until all of the data from the client has been received
	req.on("data", function(chunk){
		data += chunk.toString();
	});
	
	//once we have the entire data from the client
	req.on("end", function() {
		var json = JSON.parse(data);
		var token = json.token;
		var events = json.eventQueue ;
		var simulation= json.simulationName;
		//console.log(obj);
		SimulationManager.authToken(token, function(obj){
			//for now allow empty tokens
			if(obj.Response == 'Success'){
				console.log("Successful authenication" );
					SimulationManager.ClientRequest(token, events, function(){

					res.send(SimulationManager.getAppStateForDevice(token,simulation));
				});
				
			}
			else{
				console.log("Failed authenication" );
				console.log(json);
				SimulationManager.ClientRequest(token, events, function(){

					var state={};
					state.simulation=undefined;
					state.device=undefined;
					state.simulation_names=SimulationManager.getSimulationNames();
					res.send(state);
					
				});
			}
			
		});
		
		
	});
}); 

app.post('/authenticate/authToken', function(req, res){
	var data = '';//waits until all of the data from the client has been received
	req.on("data", function(chunk){ //if a piece of the data from the client is being received 
		data += chunk.toString();
	});
	//if we have the entire data from the client
	req.on("end", function() {
		//console.log(data);
		var obj = JSON.parse(data);
		var token = obj.token;
		SimulationManager.authToken(token, function(obj){
			res.send(obj);
		});
		
	});
});
/*
 * Routes call for the homepage of our website.
 */
app.get('/', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});	
}); 
/*
 * Routes call for the homepage of our website.
 */
app.get('/index', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});
	
}); 


app.use(express.static(path.join(__dirname, 'public')));
//use the app to serve middleware static pages rather than doing each as a get request
app.use("/css",  express.static(__dirname + '/public/stylesheets'));
app.use("/logic", express.static(__dirname + '/public/ClientJS/ClientLogic'));
app.use("/template", express.static(__dirname + '/public/ClientJS/HTML_Templates'));
app.use("/view", express.static(__dirname + '/public/ClientJS/Views'));
app.use("/gui", express.static(__dirname + '/public/ClientJS/GUI'));
app.use("/js",  express.static(__dirname + '/public/ClientJS'));
app.use("/img",  express.static(__dirname + '/public/img'));


