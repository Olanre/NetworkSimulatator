function NetworksListTemplate(networks, local_device){
	
	var networks_created = local_device.networks_created;
	var str = "<table>";
	console.log(networks);
	for(var i = 0; i< networks.length; i++){
		//if(local_device.current_network == networks[i]['network_name']){
			//str +=  "<td> <div onclick = 'removeDevicefromNetwork( &quot;" + local_device.current_device_name + "&quot;, &quot;" + networks[i]['network_name'] + "&quot;)'> " +
			//"Leave Network </div> </td> </tr>";
		//}
		//else{
			str += "<tr  id = '" + networks[i]['network_name'] + "'>" +
				" <td> " + networks[i]['network_name'] + 
				" <div class = 'btn btn-primary' onclick = 'moveDeviceToNetwork( &quot;" + local_device.token + "&quot;, &quot;" + networks[i]['_id'] + "&quot;) '> " +
							"Join Network </div> </td> </tr>";
		//}
		if(networks_created !== undefined && networks_created !== null && networks_created.length > 0){
			for(var j = 0; j < networks_created.length; j++){
				
				if( networks[i]['network_name'] == networks_created[j] ){
					str +=  "<td> <div class = 'btn btn-primary' onclick = 'deleteNetwork( &quot;" + networks[i] + "&quot;)'> " +
					"Join Network </div> </td> </tr>";
				}
			}
		}
	}
	str += "</table>" +"";
	return str;
}