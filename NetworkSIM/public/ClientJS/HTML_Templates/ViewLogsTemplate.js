/**
 * New node file
 */
/**
 * SimulationLogsTemplate template for viewing the logs of this 
 * simulation
 * @param logs: The list of logs for this simulation.
 */
function SimulationLogsTemplate(logs){
	var template = document.getElementById('template17').innerHTML;
	 textile = Hogan.compile(template);
	 context = {'logs' : logs};
	 tpl = textile.render(context);
	 return tpl;
}