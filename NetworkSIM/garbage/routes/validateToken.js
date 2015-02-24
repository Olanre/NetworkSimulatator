/**
 * New node file
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var server = require('../Server');

router.get('/', function(req, res) {  // sample get function
	
	res.send("this is '/validateToken'!");
	console.log("> routed validate token!");
});


router.post('/', function(req, res) {
	
	console.log(">validating token");
	var entireResponse = '';
	req.on("data", function(chunk) {
		
		entireResponse += chunk.toString();
	});
	req.on("end",function() {
		
		if (entireResponse == "goatse") {  // goatse?
			res.send(true);
		}
		else {
			res.send(false);
		}
	});
});

module.exports = router;