/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.get('/', function(req, res) {
	
	res.send("/delete/Device is working");
});


router.delete('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('DELETE', '/delete/Device');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';
	
	res.on('data', function(chunk) {
	    data += chunk;
	});
	
	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var device_name = obj.device_name;
	    var network_name = obj.network_name;
	    var partition_name = obj.partition_name;
	    var simulation_name = obj.simulation_name;
	    
	    console.log('> created json object');
	    // noah's function call here
	});
	//console.log(dataToSend);  // for testing
	//res.json(JSON.stringify(data));
});


module.exports = router;