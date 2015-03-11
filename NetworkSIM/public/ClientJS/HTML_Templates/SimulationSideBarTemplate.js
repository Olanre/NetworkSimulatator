/**
 * New node file
 */
function SimulationSideBarView(id){
	console.log(id);
	var template = document.getElementById('template18').innerHTML;
	 textile = Hogan.compile(template);
	 context = {'simulation_id' : id};
	 
	 tpl = textile.render(context);
	 console.log(tpl);
	 return tpl;
}