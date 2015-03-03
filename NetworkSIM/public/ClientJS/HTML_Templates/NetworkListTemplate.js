function NetworksListTemplate(networks){
	var local_device = get_local_device();
	var sim = local_device.current_simulation;
	var networks_created = local_device.networks_created;
	var str = "<table>";

	for(var i = 0; i< networks.length; i++){
		if(local_device.current_network == networks[i]){
			str +=  "<td> <div onclick = 'removeDevicefromNetwork( &quot;" + local_device.current_device_name + "&quot;, &quot;" + networks[i] + "&quot;)'> " +
			"Leave Network </div> </td> </tr>";
		}
		else{
			str += "<tr  id = '" + networks[i] + "'>" +
				" <td> " + networks[i] + "   " +
				" <div onclick = 'addDevice2Network( &quot;" + local_device.current_device_name + "&quot;, &quot;" + networks[i] + "&quot;) '> " +
							"Join Network </div> </td> </tr>";
		}
		for(var j = 0; j < networks_created.length; j++){
			if( networks[i] == networks_created[j] ){
				str +=  "<td> <div onclick = 'deleteNetwork( &quot;" + networks[i] + "&quot;)'> " +
				"Join Network </div> </td> </tr>";
			}
		}
	}
	str += "</table>" +"";
	return str;
}