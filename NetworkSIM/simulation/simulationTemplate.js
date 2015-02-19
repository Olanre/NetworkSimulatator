/**
 * New node file
 */

/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */
function getSimulationTemplate(){
	var session_data = {};
	session_data.num_devices = 0;
	session_data.num_networks = 0;
	session_data.simulation_population = 0;
	session_data.simulation_name = '';
	session_data.config_map = {};
	session_data.freelist = {};
	session_data.tokenMethod = '';
	session_data.globalcount = 0;
	session_data.activity_logs = '';
	return session_data;
}

module.exports.getSimulationTemplate = getSimulationTemplate;