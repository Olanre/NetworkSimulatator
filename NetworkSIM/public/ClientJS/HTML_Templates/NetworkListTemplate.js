/**
 * Template for a page containing a list of all networks in the simulation
 */
function NetworksListTemplate(networks, local_device){
	//gets the networks created by a device
	var networks_created = local_device.networks_created;
	//str holds the html for the page
	var str = "<h1 class='flip-up-text'>Available Networks</h1>"+"<br>"+
			"<div id='network-scroll-table-wrapper' >"+
			"<div id='network-scroll-table-scroll'>"+
			"<table class='center-table'>"+
				"<thead>"+
					"<tr>"+
						"<td><scpan class='table-header-text'>Network Name</td></span>"+
						"<td><scpan class='table-header-text'>Network Population</td></span>"+
						"<td><scpan class='table-header-text'>Action</td></span>"+
					"</tr>"+
				"</thead>"+
				"</tbody>";
	//for each network, add html for interacting with that network to the page
	for(var i = 0; i< networks.length; i++){
		//if this network is the current network containing this device
		if(local_device.current_network == networks[i]['_id']){
			str +=  "<tr id = '" + networks[i]['_id'] + "'> " +
					" <td> " + networks[i]['network_name'] +  " </td>" +"<td>"+ networks[i].device_list.length+"</td>"+
					" <td>   <div class = 'btn btn-primary' onclick = 'leaveNetworkWrapper( &quot;" + local_device.token + "&quot;, &quot;" + networks[i]['_id'] + "&quot;)'>  " +
			"Leave Network </div>  </td> </tr>";
		}
		//otherwise create a button for joining this network
		else{
			str += "<tr  id = '" + networks[i]['_id'] + "'>" +
				" <td> " + networks[i]['network_name'] + " </td>" +"<td>"+ networks[i].device_list.length+"</td>"+
				" <td> <div class = 'btn btn-primary' onclick = 'joinNetworkWrapper( &quot;" + local_device.token + "&quot;, &quot;" + networks[i]['_id'] + "&quot;) '> " +
							"Join Network </div> </td> </tr>";
		}
		//for each network created by this device
		if(networks_created !== undefined && networks_created !== null && networks_created.length > 0){
			for(var j = 0; j < networks_created.length; j++){
				
				if( networks[i]['_id'] == networks_created[j] ){
					str +=  "<td> <div class = 'btn btn-primary' onclick = 'deleteNetwork( &quot;" + networks[i]['_id'] + "&quot;)'> " +
					"Delete Network </div> </td> </tr>";
				}
			}
		}
	}
	//end the table
	str += "</tbody></table>" +"</div></div>";
	return str;
}