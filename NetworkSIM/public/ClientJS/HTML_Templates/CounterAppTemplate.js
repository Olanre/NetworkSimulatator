/**
 * New node file
 */
function CounterAppTemplate( device){
	var template = document.getElementById('template7').innerHTML;
	textile = Hogan.compile(template);
	context = device;
	tpl = textile.render(context);
	return tpl;
}