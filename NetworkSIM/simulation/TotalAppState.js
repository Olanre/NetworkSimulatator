/**
 * New node file
 */
var deviceState = require("./deviceState.js");
var SimulationState = require("./simulationState");
var applicationState = require("./applicationState");



function getTotalState(){
	var appstate = {};
	appstate.user = deviceState.getDeviceState();
	appstate.current_simulation_session = SimulationState.getSimulationState();
	appstate.application = applicationState.getApplicationState();
	return appstate;
}



module.exports.getTotalState = getTotalState;