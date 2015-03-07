function SimulationListTemplate(simulations){
	console.log(simulations);
	var local_device = get_local_device();
	var str = "<div class = 'simulations_management'> ";
	str += " <table id = 'simslist'> ";
	if(simulations !== null && simulations !== undefined ){
		for (var i =0 ; i < simulations.length; i++) {
			 str += "	<tr> " + "<td> <div class = 'sim-name'>  " + simulations[i].simulation_name + " </div> </td> " +
				  "<td> <div class = 'num-devices'> Number of Devices: " + simulations[i].num_devices+ " </div> </td> " +
				  "<td> <div class = 'num-networks'> Number of Networks: " + simulations[i].num_networks+ " </div> </td> ";
			 		
			 if(local_device.current_simulation == simulations[i].simulation_name ){
				 str += "<td> <div class = 'aButton' onclick = 'h()'> View </div> </td> </tr>";
			 }else{
				 str += "<td> <div class = 'aButton' onclick = 'RegisterView(&quot;" + simulations[i].simulation_id + "&quot;)' > Register  </div> </td> </tr>";
			 }
		}	
	}
	str +=  " </table> 	</div>";
	return str;
}
