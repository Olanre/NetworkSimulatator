/****
 * This module is responsible for server-related actions and calls.
 * Please note that the relevant routing is under routing.js
 ****/

var express = require('express');
var path = require('path');
var logger = require('express-logger');
var SimulationManager = require('./Server/SimulationManager');
var Database = require("./Database/mongooseConnect.js");
var Router = require("./Server/routing.js");



var app = express();
var globalCount = 0;
var port = 3332;  // must be on port 3332 on excalibur for the grader


var server = app.listen(port, function () { 

	var Application = {};

	
Database.getApp(function(data){
	if(data == null){
		//Application.simulation_list = [];
		//Application.total_devices = 0;
		//Application.total_networks = 0;
		//Application.super_admin = {};
		//Database.addApp(Application);
		
		//no longer needed
		//should instead get all simulation objects from the database and load them into the server
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

app.post("/getSync", Router.sync);

app.post("/authenticate/authToken", Router.authToken );

app.get('/', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});	
}); 

app.get('/index', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});
	
}); 


app.use(express.static(path.join(__dirname, 'public')));


app.use("/css",  express.static(__dirname + '/public/stylesheets'));
app.use("/logic", express.static(__dirname + '/public/ClientJS/ClientLogic'));
app.use("/template", express.static(__dirname + '/public/ClientJS/HTML_Templates'));
app.use("/view", express.static(__dirname + '/public/ClientJS/Views'));
app.use("/gui", express.static(__dirname + '/public/ClientJS/GUI'));
app.use("/js",  express.static(__dirname + '/public/ClientJS'));
app.use("/img",  express.static(__dirname + '/public/img'));


