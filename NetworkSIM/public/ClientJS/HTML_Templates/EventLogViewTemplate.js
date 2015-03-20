function EventLogViewTemplate(simulationJSON){
	var template = document.getElementById('template24').innerHTML;
	 textile = Hogan.compile(template);
	 tpl = textile.render(simulationJSON);
	 return tpl;
}