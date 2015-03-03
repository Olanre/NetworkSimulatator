/** Template for generating the information pertaining a a user's account
 * contains information about the account from the local_device data
 * @returns str, the generated html string for the template
 */
function AccountTemplate(){
	var local_device = get_local_device();
	var str = "<div>" +
		"<h2> Hello " + local_device.current_device_name + " in " + local_device.current_simulation + "</h2>" +
		"</div> " +
			"<div class = 'container'>" +
				"<div class = 'appinterface'> You Email: " + local_device.email + "</div>" +
"<div class = 'counters'> <table>" +
	"<tr> <td> " +
		 "<div> RegistedOn: " +  local_device.registeredOn + "  </div> " +
	"</td> "+
" </tr> " +
"<tr> <td> " +
"<div> Token: " +  local_device.token + "  </div> " +
"</td> "+
" </tr> " +
"<tr> <td> " +
"<div> Current Partition: " +  local_device.current_partition + "  </div> " +
"</td> "+
"</tr> " +
"<tr> <td> " +
"<div> Current Network: " +  local_device.current_network + "  </div> " +
"</td> "+
" </tr> " +
" </table> " +
"</div> " +
"</div>";
	return str;
}