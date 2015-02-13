/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.delete('DELETE request to homepage', '/Delete/PartitionMap');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';
	
	res.on('data', function(chunk) {
	    data += chunk;
	});
	
	res.on('end',function() {
	    var obj = JSON.parse(data);
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