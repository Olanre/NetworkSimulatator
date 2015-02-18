/**
 * New node file
 */
var deviceTemplate = require("./deviceTemplate.js");
var SimulationTemplate = require("./simulationTemplate");
var applicationTemplate = require("./applicationTemplate");



function getTotalTemplate(){
	var appTemplate = {};
	appTemplate.user = deviceTemplate.getDeviceTemplate();
	appTemplate.current_simulation_session = SimulationTemplate.getSimulationTemplate();
	appTemplate.application = applicationTemplate.getApplicationTemplate();
	return appTemplate;
}



module.exports.getTotalTemplate = getTotalTemplate;