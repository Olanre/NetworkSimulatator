/**
 * New node file
 */

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var SimulationManager = require('../../simulation/SimulationManager');

router.use(bodyParser.json());
	
/*
router.get('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('GET', '/get/Sync');  // * was request.send(). supposed to be .open() *
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	res.send('/get/Sync requested!');
	console.log('> /get/Sync called');  // log it to console
	
	var data = '';
	
	req.on('data', function(chunk) {
	    data += chunk;
	});
	
	req.on('end',function() {
	    var obj = JSON.parse(data);
	    var token = obj.token;
	    var eventQueue = obj.eventQueue;
	    
	    SimulationManager.clientRequest(token, eventQueue);
	});

	//console.log(dataToSend);  // for testing
	//res.json(JSON.stringify(data));
});
*/


/*
router.post("/", function(req, res) {

	var data = '';//waits until all of the data from the client has been received
	req.on("data", function(chunk){ //if a piece of the data from the client is being received 
		data += chunk.toString();
	});
	//if we have the entire data from the client
	req.on("end", function() {
		console.log(data);
		var obj = JSON.parse(data);
		var token = obj.token;
		var eventqueue = obj.eventQueue;
		SimulationManager.ClientRequest(token, eventqueue);
		if( token == ''){
			res.send(SimulationManager.startState());
		}else{
			res.send('Nice');  // lol ?
		}
	});
	 res.send("okay!");
});
*/

router.post("/", function(req, res) {
	var okay = true;
	var obj = req.body;
	var token = obj.token;
	var eventqueue = obj.eventQueue;
	SimulationManager.ClientRequest(token, eventqueue);
	if (token == '') {
		res.send(SimulationManager.startState());
	} else {
		res.json({
			Response: okay ? 'Success' : 'Failure'
		});
	}
});


module.exports = router;
