/**
 * New node file
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var server = require('../Server');

router.post('/', function(req, res) {
	
	var data = '';//waits until all of the data from the client has been received
	req.on("data", function(chunk) { //if a piece of the data from the client is being recieved 
		data += chunk.toString();
	});
	//if we have the entire data from the client
	req.on("end", function() {
		
		deviceState = JSON.parse(data);
		eventHandler.updateState(deviceState);
	});
});

module.exports = router;