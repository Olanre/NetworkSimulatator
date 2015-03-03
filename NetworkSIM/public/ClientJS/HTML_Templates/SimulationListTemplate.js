function SimulationListTemplate(simulations){
	var local_device = get_local_device();
	var str = "<div class = 'simulations_management'> ";
	str += " <table id = 'simslist'> ";
	for (var i =0 ; i < simulations.length; i++) {
		 str += "	<tr> " + "<td> <div class = 'sim-name'>  " + simulations[i].name + " </div> </td> " +
			  "<td> <div class = 'num-devices'> Number of Devices: " + simulations[i].num_devices+ " </div> </td> " +
			  "<td> <div class = 'num-networks'> Number of Networks: " + simulations[i].num_networks+ " </div> </td> ";
		 		
		 if(local_device.current_simulation == simulations[i].name ){
			 str += "<td> <div class = 'aButton' onclick = 'h()'> View </div> </td> </tr>";
		 }else{
			 str += "<td> <divclass = 'aButton' onclick = 'RegisterView()' > Register  </div> </td> </tr>";
		 }
	}	
	str +=  " </table> 	</div>";
	return str;
}
