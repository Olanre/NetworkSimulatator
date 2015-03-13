/**
 * New node file
 */
function viewAdminApplicationsTemplate(applications){
	var template = document.getElementById('template19').innerHTML;
	 textile = Hogan.compile(template);
	 context = {'apps' : applications};
	 tpl = textile.render(context);
	 return tpl;
}