/**
 * New node file
 */

var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('POST', '/create/Network');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';

	res.on('data', function(chunk) {
	    data += chunk;
	});

	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var network_name = obj.networkname;
	    var simulation_name = obj.simulation_name;
	    var partition_name = obj.Partition_name;
	    console.log('> created json object');
	    // noah's function call
	});
	
	res.json(JSON.stringify(data));
});


module.exports = router;