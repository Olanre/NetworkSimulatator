/** Template for generating the information pertaining a a user's account
 * contains information about the account from the local_device data
 * @returns str, the generated html string for the template
 */
function AccountTemplate(device){
	var template = document.getElementById('template12').innerHTML;
	 textile = Hogan.compile(template);
	 context = device;
	 console.log(context);
	 tpl = textile.render(context);
	 return tpl;
}