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
    
    socket.on("/getSync", Router.sync);

    socket.on("/authenticate/authToken", Router.authToken );
    
    
};
 

io.on("connection", handleClient);

server.listen(3000, function(){
	  console.log('listening on *:3000');
	});

app.get('/', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});	
}); 

app.get('/index', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});
	
}); 

/* does this get moved into the createSimulation.js module too? */


 
//exports.globalCount = globalCount;  // use globalCount in other modules under routes/
