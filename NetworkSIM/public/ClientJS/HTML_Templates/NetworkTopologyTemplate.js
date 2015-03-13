function NetworkTopologyTemplate(simulationJSON){
	var template = document.getElementById('template21').innerHTML;
	 textile = Hogan.compile(template);
	 tpl = textile.render(simulationJSON);
	 return tpl;
}