/**
 * New node file
 */
/** 
 * Function to give the list of devices as well as an option to delete one if needed
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function AdminDevicesListTemplate(devices){
		var template = document.getElementById('template16').innerHTML;
		 textile = Hogan.compile(template);
		 context = { 'devices' : devices};
		 tpl = textile.render(context);
		 return tpl;
}

/** 
 * Function to give the list of devices within the current simulation in
 * a rendered html format. This function specifies the template of the layout
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function DevicesListTemplate(devices){
	var template = document.getElementById('template14').innerHTML;
	 textile = Hogan.compile(template);
	 var devicesClone = deepCopy(devices);
	 var simulation = get_local_simulation();
	 for(dev in devicesClone){

	 	for(index in simulation.partition_list){
			var network = findByUniqueID(devicesClone[dev].current_network, simulation.partition_list[index].network_list);
			if(network!=-1){
				devicesClone[dev].current_network = network.network_name;
				break;
			}
		}
	 }

	 context = { 'devices' : devicesClone};
	 tpl = textile.render(context);
	 return tpl;
}