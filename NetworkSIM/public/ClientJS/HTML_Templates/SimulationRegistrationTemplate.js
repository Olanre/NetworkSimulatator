/**
 * New node file
 */
function SimulationRegistrationTemplate(id){
	var template = document.getElementById('template8').innerHTML;

	 textile = Hogan.compile(template);
	 context = id;
	 tpl = textile.render(context);
	 return tpl;
}