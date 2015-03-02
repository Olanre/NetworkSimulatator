function viewDeviceTemplate(){
	var local_device = get_local_device();
	var local_session = get_local_session();
	var app_name = local_device.current_simulation;
	
	var str = "<div>" +
				"<h2> Hello " + local_device.current_device_name + " in " + local_device.current_simulation + "</h2>" +
				"<h3> You are now in " +  local_device.current_network + " " +
						" <br> There are " + local_session.simulation_population + " other devices  in this simulation</h2>" +
			"</div> " +
			"<div class = 'container'>" +
				"<div class = 'appinterface'>" + appView() + "</div>" +
			"<div class = 'counters'> <table border='1'>" +
	"</div> " +
"</div>";
	return str;
	
}