/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var server = require('../Server');  // ../ indicated one directory level above


router.get('/', function(req, res) {
	
	res.sendFile("CreateSimA.html", {"root": path.join(__dirname, '../ajax') });
});

router.post("/", function(req, res) {
	var entireResponse = '';//waits until all of the data from the client has been received
	req.on("data", function(chunk){ //if a piece of the data from the client is being received 
		entireResponse += chunk.toString();
	});
	//if we have the entire data from the client
	req.on("end", function() {
		//call whatever functions you want here
		numberOfDevices;//get this from entireResponse by parsing it
		numberOfNetworks;//get this from entire response by parsing it
		tokenPropagationMethod; //get this from entire response by parsing it
		SOMEFUNCTION(numberOfDevices,numberOfNetworks,tokenPropagationMethod); //DO WHATEVER IT SAYS IN THE SEQUENCE DIAGRAM NOW
	});
});

module.exports = router;