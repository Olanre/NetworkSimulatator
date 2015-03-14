/**
 * New node file
 */
function viewRDTsTemplate(rdts){
	var template = document.getElementById('template20').innerHTML;
	 textile = Hogan.compile(template);
	 context = {'rdts' : rdts};
	 tpl = textile.render(context);
	 return tpl;
}