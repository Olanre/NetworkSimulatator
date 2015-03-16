/**
 * New node file
 */
function viewTestsTemplate(tests){
	var template = document.getElementById('template23').innerHTML;
	 textile = Hogan.compile(template);
	 context = {'tests' : tests};
	 tpl = textile.render(context);
	 return tpl;
}