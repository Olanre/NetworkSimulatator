/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.delete('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.send('DELETE request to homepage', '/Delete/Token');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';
	
	res.on('data', function(chunk) {
	    data += chunk;
	});
	
	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var token = obj.token;
	    
	    console.log('> created json object');
	    // noah's function call here
	});
	
	//console.log(dataToSend);  // for testing
	res.json(JSON.stringify(data));
});


module.exports = router;