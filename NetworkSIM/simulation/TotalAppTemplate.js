/**
 * New node file
 */
var Device = require("./Device.js");
var Simulation = require("./Simulation.js");
var applicationTemplate = require("./applicationTemplate");



function getTotalTemplate(){
	var appTemplate = {};
	appTemplate.user = Device.getTemplate;
	appTemplate.current_simulation_session = Simulation.getTemplate();
	appTemplate.application = applicationTemplate.getApplicationTemplate();
	return appTemplate;
}



module.exports.getTotalTemplate = getTotalTemplate;