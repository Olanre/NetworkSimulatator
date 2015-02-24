var express = require('express');
var router = express.Router();
var Server = require('../Server');


router.get('/', function(req, res) {  // the code below is simply for testing

	console.log("> '/src' path requested");
	res.send("This is sample text to test functionality. This is /src!");
});

module.exports = router;