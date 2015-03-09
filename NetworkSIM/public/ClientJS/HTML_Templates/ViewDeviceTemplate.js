function viewDeviceTemplate(device, simulation){
	
	var template = document.getElementById('template11').innerHTML;
	 textile = Hogan.compile(template);
	 context = merge_objects(device, simulation);
	 tpl = textile.render(context);
	 return tpl;
	
}