/**
 * New node file
 */
function DeviceAppsListTemplate(applications){
	var template = document.getElementById('template22').innerHTML;
	 textile = Hogan.compile(template);
	 context = {'apps' : applications};
	 tpl = textile.render(context);
	 return tpl;
}