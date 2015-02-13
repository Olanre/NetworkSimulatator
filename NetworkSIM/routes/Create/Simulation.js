//<<<<<<< HEAD
/**
 * New node file
 */

var express = require('express');
var router = express.Router();
var simulationManager=require("../../simulation/SimulationManager.js");
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('POST', '/create/Simulation');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';

	res.on('data', function(chunk) {
	    data += chunk;
	});

	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var name = obj.name;
	    var email_list = obj.email_list;
	    var num_devices = obj.num_devices;
	    var num_network = obj.num_network;
	    var config_map = obj.config_map;
	    var tokenMethod = obj.tokenMethod;
	    console.log('> created json object');
	   var simulation= simulationManager.createSimulation(name,email-list,tokenMethod,num-devices,numNetworks);
	   simulationManager.setUpNetworks(simulation,config-map);
	});
	
	res.json(JSON.stringify(data));
	//res.send("/create/Simulation is working!");
});


module.exports = router;
//=======
/**
 * New node file
 */
/*
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/', function(req, res) {
	
	var request = new XMLHttpRequest();
	request.open('POST', '/create/Simulation');
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	var data = '';

	res.on('data', function(chunk) {
	    data += chunk;
	});

	res.on('end',function() {
	    var obj = JSON.parse(data);
	    var name = obj.name;
	    var email_list = obj.email_list;
	    var num_devices = obj.num_devices;
	    var num_network = obj.num_network;
	    var config_map = obj.config_map;
	    var tokenMethod = obj.tokenMethod;
	    console.log('> created json object');
	    // noah's function call here
	});
	
	res.json(JSON.stringify(data));
	//res.send("/create/Simulation is working!");
});


module.exports = router;
>>>>>>> refs/remotes/origin/master
*/