/****
 * This module is responsible for server-related actions and calls.
 * Please note that the routing javascript code is located under
 * the routes folder within src.
 * @Author: Noah
 * @editedBy Ryan (Jan. 30)
 ****/

var express = require('express');
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
****/
var Get = require('./routes/Get');
var Authenticate = require('./routes/Authenticate');


var app = express();
var globalCount = 0;
var port = 3332;  // must be on port 3332 on excalibur for the grader


var server = app.listen(port, function () { 
	
	var Application = {};
	//var item =  { 'name' : body.name, 'num_networks': body.num_networks, 'num_devices': body.num_devices};
	
	Database.getApp(function(data){
		if(data == null){
			Application.simulation_list = [];
			Application.total_devices = 0;
			Application.total_networks = 0;
			Application.super_admin = {};
			Database.addApp(Application);
		}else{
			console.log('App already exists');
		}
	});
  var host = server.address().address;
  console.log('Server listening at http://%s:%s', host, port);
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
		var obj = JSON.parse(data);
		var token = obj.token;
		var eventqueue = obj.eventQueue;
		//console.log(obj);
		SimulationManager.authToken(token, function(obj){
			//for now allow empty tokens
			if(obj.Response == 'Success'){
				console.log("successful authenication" );
				SimulationManager.ClientRequest(token, eventqueue, function(){
					SimulationManager.getNewState(token, function(data){
						if(data == null){
							SimulationManager.startTemplate(function(data){
								console.log("Send blank state");
								res.send(data);
							});
						}else{
							console.log("Send newstate");
							//console.log(data);
							res.send(data);
						}
					});
					
				});
			}else{
				console.log("failed authenication" );
				SimulationManager.ClientRequest(token, eventqueue, function(){
					SimulationManager.startTemplate(function(data){
						console.log("Send blank state");
						res.send(data);
					});
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
	response.sendFile("/public/stylesheets/dashboard.css", {"root": __dirname});
	
}); 
app.get('/css/bootstrap.min.css', function(request,response){
	response.sendFile("/public/stylesheets/bootstrap.min.css", {"root": __dirname});
	
});
app.get('/css/main.css', function(request,response){
	response.sendFile("/public/stylesheets/main.css", {"root": __dirname});
	
});
app.get('/GUIDesign.js', function(request, response){
	response.sendFile("/views/GUIDesign.js", {"root": __dirname});
});

app.get('/css/topologyView.css',function(request,response){
	response.sendFile("/public/stylesheets/topologyView.css",{"root":__dirname});
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
app.get('/js/interact-1.2.2.js', function(request,response){
	response.sendFile("/public/ClientJS/interact-1.2.2.js", {"root": __dirname});
	
});
app.get('/js/network-topology.js', function(request,response){
	response.sendFile("/public/ClientJS/toplogyManipulationGUI.js", {"root": __dirname});
	
});
app.get('../js/simulation-classes.js', function(request,response){
	response.sendFile("/simulation/network_topology.js");
});


//exports.globalCount = globalCount;  // use globalCount in other modules under routes/
