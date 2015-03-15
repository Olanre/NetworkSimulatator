//var SimMan=require("../../Server/SimulationManager.js");
var Util=require("../../Utilities/utilities.js");
var Device=require('../../Model/Device.js');

/*var simJSON={
		num_devices: 12,
		num_networks: 3,
		simulation_population: undefined,
		simulation_name: 'hellothere',
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
};*/
function testCreateSimulation(){
	var sim=SimMan.createSimulation(simJSON);
	return true;
}

function testAuthenticate(){
	var simulation=SimMan.createSimulation(simJSON);
	var token=simulation.partition_list[0].network_list[0].device_list[0].token;

	SimMan.authToken(token,simulation._id,function(res){
		var result=res.Response=='Success';
		if(!result)console.log("testAuthenticate failed" +res.Response);
		return result;
	});

}

function testSimulationNames(){
	var names=['test1','test2','test3','test4'];
	var simulation_list=[];

	for(var i=0;i<4;i++){
		simJSON.simulation_name=names[i];
		simulation_list[i]= SimMan.createSimulation(simJSON);
	}
	var received_names=SimMan.getSimulationNames();
	var result=Util.compareObjects(names,received_names);
	if(!result) console.log("testSimulationNames failed \n"+received_names);
	return result;
}

function testSimulationList(){
	var names=['test4','test3','test2','test1'];
	var ids=[];
	var createdSim={};
	for(var i=0;i<4;i++){
		simJSON.simulation_name=names[i];
		createdSim=SimMan.createSimulation(simJSON);
		ids.push(createdSim._id);
	}
	var simlist=SimMan.getSimulationList();
	console.log(simlist);

}

function testCreateDevice(){
	var event_data={
			simulation_id: '',
			device_name: 'testdevice'
		};
	var createdSim=SimMan.createSimulation(simJSON);
	event_data.simulation_id=createdSim._id;
	var oldDeviceList=createdSim.device_list;
	SimMan.createDevice(event_data);

	var deviceList=createdSim.device_list;

	var result=(deviceList.length-1)==oldDeviceList.length;
	if(!result) console.log("testCreateDevice failed \n"+deviceList);
	return result;

}

function testCreateNetwork(){
	var event_data={
			network_name: 'testNetwork444',
			simulation_id: ''
	};

	var createdSim=SimMan.createSimulation(simJSON);
	event_data.simulation_id=createdSim._id;
	SimMan.createNetwork(event_data);
	var networks=createdSim.getNetworks();
	var found = Util.findNetworkByName('testNetwork444',networks);
	console.log(found);

}
function testMoveDevice(){
	var event_data={
			network_id: 'string',
			simulation_id: 'string',
			device_token: 'string'
	};
	var simulation=SimMan.createSimulation(simJSON);
	var device=simulation.device_list[0];
	var token=device.deviceJSON.token;
	event_data.device_token=token;
	var network=Util.findNetworkByName('networkc',simulation.getNetworks());
	event_data.network_id=network._id;
	event_data.simulation_id=simulation._id;

	SimMan.addDeviceToNetwork(event_data);

	console.log(device.networkObject);
	var found = Util.findByUniqueID(device._id,network.device_list);
	console.log(found);

}

function testGetAppState(){

	var simulation=SimMan.createSimulation(simJSON);
	var device=Device.createNewDevice("testdev");
	simulation.addDevice(device);
	var token=device._id;

	var appState=SimMan.getAppStateForDevice(token,simulation._id);
	console.log(appState);

}

function testBuildPartitions(){
	var simulation=SimMan.createSimulation(simJSON);
	var partition_list=SimMan.buildPartitionList(simulation);
	console.log(partition_list);
	
	for(partition in partition_list){
		console.log(partition_list[partition].network_list);
	}
}



function testAll(){
	var functions=[];

	//functions.push(testCreateSimulation);
	//functions.push(testAuthenticate());
	//functions.push(testCreateDevice());
	//functions.push(testCreateNetwork);
	//functions.push(testMoveDevice);
	//functions.push(testGetAppState);
	//functions.push(testBuildPartitions);
	var continueTesting=true;
	for(var i=0;i<functions.length;i++){
		continueTesting=continueTesting&&functions[i];
		if(!continueTesting)break;
	}
	return continueTesting;
}
//testBuildPartitions();
//testAll();
//testPopulateServer();