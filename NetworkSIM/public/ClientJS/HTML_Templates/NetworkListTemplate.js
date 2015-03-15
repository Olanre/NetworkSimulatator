function NetworksListTemplate(networks, local_device){
	
	var networks_created = local_device.networks_created;
	var str = "<table>";
	console.log(networks);
	for(var i = 0; i< networks.length; i++){
		if(local_device.current_network == networks[i]['_id']){
			str +=  "<tr id = '" + networks[i]['_id'] + "'> " +
					" <td> " + networks[i]['network_name'] +  " </td>" +
					" <td> <!--  <div class = 'btn btn-primary'  onclick = 'removeDevicefromNetwork( &quot;" + local_device.token + "&quot;, &quot;" + networks[i]['_id'] + "&quot;)'>  " +
			"Leave Network </div> --> </td> </tr>";
		}
		else{
			str += "<tr  id = '" + networks[i]['_id'] + "'>" +
				" <td> " + networks[i]['network_name'] + " </td>" +
				" <td> <div class = 'btn btn-primary' onclick = 'moveDeviceToNetwork( &quot;" + local_device.token + "&quot;, &quot;" + networks[i]['_id'] + "&quot;) '> " +
							"Join Network </div> </td> </tr>";
		}
		if(networks_created !== undefined && networks_created !== null && networks_created.length > 0){
			for(var j = 0; j < networks_created.length; j++){
				
				if( networks[i]['_id'] == networks_created[j] ){
					str +=  "<td> <div class = 'btn btn-primary' onclick = 'deleteNetwork( &quot;" + networks[i]['_id'] + "&quot;)'> " +
					"Join Network </div> </td> </tr>";
				}
			}
		}
	}
	str += "</table>" +"";
	return str;
}