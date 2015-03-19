function SimulationDataListTemplate(simulations){
	var local_device = get_local_device();
	var str = '<h1 class="flip-up-text">List of current Simulations</h1>'+ "<div class = 'simulations_management'> ";
	str += " <table id = 'simslist'> ";
	str+="<tr><td>Simulation Name</td><td>Number of Devices</td><td>Number of Networks</td><td>Action</td></tr>";
	if(simulations !== null && simulations !== undefined ){
		for (var i =0 ; i < simulations.length; i++) {
			 str += "	<tr> " + "<td> <div class = 'sim-name'>  " + simulations[i].simulation_name+ " </div> </td> " +
				  "<td> <div class = 'num-devices'>" + simulations[i].num_devices+ " </div> </td> " +
				  "<td> <div class = 'num-networks'>" + simulations[i].num_networks+ " </div> </td> ";
			 		
			 if(local_device.verified == true && local_device.current_simulation === simulations[i].simulation_id){
				 str += "<td> <div  class = 'btn btn-primary'  onclick = 'SimulationManagementView()'> View </div> </td>";
			 }else{
				 str += "<td> <div  class = 'btn btn-primary'  onclick = 'RegisterView(&quot;" + simulations[i].simulation_id + "&quot;)' > Register  </div> </td> ";
			 }
			 str += " </tr>";
		}	
	}
	str +=  " </table> 	</div>";
	return str;
}

//might want to use this instead, have to talk to Noah
function SimulationListTemplate(simulations){
	var local_device = get_local_device();
	var str = '<h1 class="flip-up-text">List of current Simulations</h1>'+ "<div class = 'simulations_management'> ";
	str += " <table id = 'simslist'> ";
	if(simulations !== null && simulations !== undefined ){
		for (var i =0 ; i < simulations.length; i++) {
			 str += "	<tr> " + "<td> <div class = 'sim-name'>  " + simulations[i]+ " </div> </td> ";
			 		
			 if(local_device.current_simulation == simulations[i].simulation_name ){
				 str += "<td> <div  class = 'btn btn-primary'  onclick = 'deviceHeaderView()'> View </div> </td>";
			 }else{
				 str += "<td> <div  class = 'btn btn-primary'  onclick = 'RegisterView(&quot;" + simulations[i].simulation_id + "&quot;)' > Register  </div> </td> ";
			 }
			 str += "<td> <div  class = 'btn btn-primary'  onclick = 'SimulationManagementView()'> Manage </div> </td> </tr>";
		}	
	}
	str +=  " </table> 	</div>";
	return str;
}