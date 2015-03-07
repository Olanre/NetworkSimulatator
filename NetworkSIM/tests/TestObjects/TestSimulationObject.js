/*
 *Generates a simulation object for testing. Index is the maximum number of networks
 *and devices to create
 */

function generateSimulationObject(index,haveNulls){
	var simulation={};
	simulation._id='s'+0;
	simulation.num_devices=0;
	simulation.num_networks=0;
	simulation.simulation_population=69;
	simulation.simulation_name='dorian';
	simulation.tokenMethod='email';
	simulation.activity_logs='had fun';
	simulation.partition_list=[];
	for (var i=0;i<index;i++){
		partition=generatePartitionObject(index,simulation._id,i);
		simulation.partition_list.push(partition);
		simulation.num_devices+=index;
		simulation.num_networks+=index;
	}
	if (haveNulls==true){
		for (var i=0;i<2;i++){
			var nullpart=generateNullPartition(simulation._id, i);
			simulation.partition_list.push(nullpart);
		}
	}
	return simulation
}

function generateNullPartition(simulation_id, j){
	var partition={}
	partition._id='np'+j;
	partition.network_list=[];
	var null_network=generateNullNetwork(partition._id, simulation_id,0); 
	partition.network_list.push(null_network);
	return partition;
}

function generateNullNetwork(partition_id,simulation_id,j){
	var network={};
	network._id='n'+j+partition_id;
	network.network_type='';
	network.network_name='';
	network.partition=partition_id;
	network.device_list=[];
	var dev = generateDeviceObject(0,simulation_id,partition_id, network._id,0);
	network.device_list.push(dev);
	return network;
}

function generatePartitionObject(index, simulation_id,j){
	var partition={};
	partition._id='p'+j;
	partition.network_list=[];
	
	var networksToCreate=Math.floor((Math.random() * index) + 1);

	for (var i=0;i<networksToCreate;i++){
		var network=generateNetworkObject(index, partition._id, simulation_id,i);
		partition.network_list.push(network);
	}
	return partition;
}

function generateNetworkObject(index, partition_id,simulation_id,j){
	var network={};
	network._id='n'+j+partition_id;
	network.network_type='fiech';
	network.network_name='jeffs '+j+'th network';
	network.partition=partition_id;
	network.device_list=[];
	var devicesToCreate=Math.floor((Math.random() * index) + 1);
	for (var i =0; i<devicesToCreate;i++){
		device=generateDeviceObject(index, simulation_id, partition_id, network._id,i);
		network.device_list.push(device);
	}
	return network;
}

function generateDeviceObject(index, simulation_id, partition_id, network_id,i){
	var device={};
	device.token='d'+i+network_id;;
	device.email="jeff"+i+"@mun.ca";
	device.verified = true;
	device.registeredOn= "night"+index
	device.admin=false;
	device.networks_created=[];
	device.current_simulation=simulation_id;
	device.current_network=network_id;
	device.current_partition=partition_id;
	device.current_device_name="jeff"+i;
	device.activity="hung out "+i+" times";
	return device;
}

function printCreatedSimulation(simulation){
	console.log('simulationId='+simulation._id);
	console.log('simulation Name='+simulation.simulation_name);
	for (var i=0;i<simulation.partition_list.length;i++){
		console.log("partition id="+simulation.partition_list[i]._id);
		network_list=simulation.partition_list[i].network_list;
		for (var j=0; j<network_list.length; j++){
			console.log("network id="+network_list[j]._id);
			device_list=network_list[j].device_list;
			for (var k=0;k<device_list.length;k++){
				console.log("device id="+device_list[k].token);
				console.log("device name="+device_list[k].current_device_name);
			}
		}
	}
}