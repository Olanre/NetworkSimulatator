/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('POST', '/add/Device');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';
	
	res.on('data', function(chunk) {
	    data += chunk;
	});
	
	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var device_name = obj.device_name;
	    var device_network = obj.device_network;
	    var partition_name = obj.partition_name;
	    var simulation_name = obj.simulation_name;
	    var token = obj.token;
	    console.log('> created json object');
	    // noah's function call here
	});
	
	//console.log(dataToSend);  // for testing
	res.json(JSON.stringify(data));
});


module.exports = router;