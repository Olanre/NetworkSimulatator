function uploadFileTemplate(simulation){
	
	var template = document.getElementById('template19').innerHTML;
	 textile = Hogan.compile(template);
	 context = simulation;
	 tpl = textile.render(context);
	 return tpl;
	
}