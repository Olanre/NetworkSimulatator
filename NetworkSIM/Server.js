/***
 * This module is responsible for server-related actions and calls.
 * Please note that the routing javascript code is located under
 * the routes folder within src.
 * @Author: Noah
 * @editedBy Ryan (Jan. 30)
 */

var express = require('express');
var app = express();
var logger = require('express-logger');
var eventHandler = require("./EventHandler.js");

var SimulationManager = require('./simulation/SimulationManager');
var Database = require("./Database/mongooseConnect.js");


var Authenticate = require('./routes/Authenticate');
/*
var Add = require('./routes/Add');
var Create = require('./routes/Create');
var Delete = require('./routes/Delete');
*/
var Get = require('./routes/Get');
/*
var Update = require('./routes/Update');
// var start = require('./routes/start');
// etc ..
*/
var globalCount = 0;
var port = 3332;  // declare port here so changes to the port are reflected in code below
				 // must be on port 3332 on excalibur for the grader


//THIS IS OUR SERVER
var server = app.listen(port, function () {  // our server must respond to port 3332 on excalibur 
	
	var Application = {};
	//var item =  { 'name' : body.name, 'num_networks': body.num_networks, 'num_devices': body.num_devices};
	
	Database.getApp(function(data){
		//console.log(data);
		if(data == null){
			//console.log(data);
			Application.simulation_list = [];
			Application.total_devices = 0;
			Application.total_networks = 0;
			Application.super_admin = {};
			//console.log(Application);
			Database.addApp(Application);
		}else{
			console.log('App already exists');
		}
	});
  var host = server.address().address;
  console.log('Server listening at http://%s:%s', host, port);
});

app.use(logger({path: "./logfile.txt"}));  // logger


/* does this get moved into the createSimulation.js module too? */
	
app.post("/getSync", function(req, res) {
	var data = '';//waits until all of the data from the client has been received
	req.on("data", function(chunk){ //if a piece of the data from the client is being received 
		data += chunk.toString();
	});
	//if we have the entire data from the client
	req.on("end", function() {
		//console.log(data);
		var obj = JSON.parse(data);
		var token = obj.token;
		var eventqueue = obj.eventQueue;
		SimulationManager.authToken(token, function(obj){
			if(obj.Response == 'Success'){
				SimulationManager.ClientRequest(token, eventqueue, function(){
			
					SimulationManager.startState(function(data){
						res.send(data);
					});
				});
			}else{
				SimulationManager.getNewState(token, function(data){
					res.send(data);
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

app.get('/css/dashboard.css', function(request,response){
	response.sendFile("/public/css/dashboard.css", {"root": __dirname});
	
}); 
app.get('/css/bootstrap.min.css', function(request,response){
	response.sendFile("/public/css/bootstrap.min.css", {"root": __dirname});
	
});
app.get('/css/main.css', function(request,response){
	response.sendFile("/public/css/main.css", {"root": __dirname});
	
});

app.get('/img/img.png', function(request,response){
	response.sendFile("/public/img/img.png", {"root": __dirname});
	
});

app.get('/img/search.png', function(request,response){
	response.sendFile("/public/img/search.png", {"root": __dirname});
	
});
app.get('/js/main.js', function(request,response){
	response.sendFile("/public/ClientJS/main.js", {"root": __dirname});
	
}); 

//exports.globalCount = globalCount;  // use globalCount in other modules under routes/
