/**
 * New node file
 */

/**
 * application holds all of the variables related to  the current application.
 * Note: The application is just the program. A simulation is a subset of the application.
 * There will be only one application running at a time.
 */
function getApplicationTemplate(){
	var application = {};
	application.simulation_list = [];
	application.num_devices = 0;
	application.num_networks = 0;
	application.superadmin = {};
	return application;
}

module.exports.getApplicationTemplate = getApplicationTemplate;