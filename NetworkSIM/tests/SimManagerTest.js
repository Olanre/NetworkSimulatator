var SimMan=require("../Server/SimulationManager.js");

var simJSON={
		num_devices: undefined,
		num_networks: undefined,
		simulation_population: undefined,
		simulation_name: undefined,
		config_map: {
		 'Partition1': 
		 {'networka' :
		 { 'devicea' : '1',  'deviceb@mun.ca': '2', 'devicec@mun.ca':'3'},
		 'networkb' :
		 		{ 'deviced': '4', 'devicee': '5'},
		 				},
		  'Partition2':
		 { 'networkc' :
		 { 'devicef': '6', 'deviceg@mun.ca' : '7',  'deviceh@mun.ca': '8'},
		 'networkd' :
		 		{'devicei@mun.ca':'9', 'device@mun.ca': '10'},
		 		'networkTest':{},
		 				},
		  'Partition3':
		 { 'networke' : { 'devicek':'11'} },
		 'freelist' : {'devicew': '13', 'evicex' : '14'}
		 },
		tokenMethod : undefined,
		activity_logs : undefined,
};
function testCreateSimulation(){
	var sim=SimMan.createSimulation(simJSON);
	var partitions=sim.partition_list;


	var networks=sim.getNetworks();
	for(index in networks){

		//console.log(networks[index].networkName);

		for(dev in networks[index].device_list){
			console.log(networks[index].device_list[dev].device_name);
		}

	}

	console.log("device list");
	var devices=sim.getDevices();

	for(index in devices){
		console.log(devices[index].device_name);
	}
}