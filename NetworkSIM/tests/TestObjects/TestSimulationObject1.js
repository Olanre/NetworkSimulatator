/*
 *Generates a simulation object for testing. Index is the number of networks
 *and devices to create
 */

function genereateSimulationObject(index){
	var simulation={};
	simulation._id='s'+index;
	simulation.num_devices=0;
	simulation.num_networks=0;
	simulation.simulation_population=69;
	simulation.simulation_name='dorian';
	simulation.tokenMethod='email';
	simulation.activity_logs='had fun';
	simulation.partition_list=[];
	for (var i=0;i<index;i++){
		partition=generatePartitionObject(index,simulation._id);
		simulation.partition_list.push(partition);
		simulation.num_devices+=index;
		simulation.num_networks+=index;
	}
}

function generatePartitionObject(index, simulation_id){
	var partition={};
	partition._id='p'+index;
	partition.network_list=[];
	for (var i=0;i<index;i++){
		network=generateNetworkObject(index, partition._id, simulation_id);
		partition.network_list.push(network);
	}
}

function generateNetworkOBject(index, partition_id,simulation_id){
	var network={};
	network._id='n'+index+partition_id;
	network.network_type='fiech';
	network.network_name='jeffs '+index+'th network';
	network.partition=partition_id;
	network.device_list={};
	for (var i =0; i<index;i++){
		device=generateDeviceObject(index, simulation_id, partition_id, network._id);
		network.device_list.push(device);
	}
}

function generateDeviceObject(index, simulation_id, partition_id, network_name){
	var device={};
	device._id ='d'+index+network_id+partition_id;
	device.token=index;
	device.email="jeff"+index+"@mun.ca";
	device.verified = true;
	device.registeredOn= "night"+index
	device.admin=false;
	device.networks_created=[];
	device.current_simulation=simulation_id;
	device.current_network=network_id;
	device.current_partition=partition_id;
	device.current_device_name="jeff"+index;
	device.activity="hung out "+index+" times";
	return device;
}