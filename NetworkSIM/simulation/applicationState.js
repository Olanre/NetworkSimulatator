/**
 * New node file
 */


function getApplicationState(){
	var application = {};
	application.simulation_list = [];
	application.num_devices = 0;
	application.num_networks = 0;
	application.superadmin = {};
	return application;
}

module.exports.getApplicationState = getApplicationState;