/**
 * New node file
 */
/** 
 * Function to give the list of devices as well as an option to delete one if needed
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function AdminDevicesListTemplate(devices){
	//console.log(devices);
		str = "";
		for(var i = 0; i< devices.length; i++){
			str += "<tr  id = '" + devices[i] + "'> <td> " + devices[i] + "   </td>" +
					"<td> <div onclick = 'deleteDevice(&quot;" + devices[i] + "&quot;s)' > Delete Device </div> </td> </tr>";
		}
		
		return str;
}

/** 
 * Function to give the list of devices within the current simulation in
 * a rendered html format. This function specifies the template of the layout
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function DevicesListTemplate(devices){
	//console.log(devices);
		str = "";
		for(var i = 0; i< devices.length; i++){
			str += "<tr  id = '" + devices[i] + "'> <td> " + devices[i] + "  </td> </tr>";
		}
		
		return str;
}