/*****
The purpose of this class is to represent a simulation. For now it just holds onto a list of Device
objects and a network manager.
@author Emily
******/

function Simulation(simulationName){
	
	this.simulation_name=simulationName;
	this.device_list = [];
	this.network_list = [];
	
	this.addNetwork=function(network){
		networks.push(network);
	};
	this.removeNetwork=function(network){
		var networkIndex=networks.indexOf(network);
		networks.splice(networkIndex,1);
	};
	this.get

	
}


function getNetworks(map){
	var list = [];
	for (var partition in map){
		for (network in map[partition]){
			list.push(network);
		}
	}
	return list;
}

function getNetworksinPartition(map, partition){
	var list = [];
	for (network in map[partition]){
		list.push(network);
	}
	return list;
}

function getDevices(map){
	var networklist = getNetworks(map);
	var list = [];
	for( var i = 0; i < networklist.length; i++){
		var devicelist = getDevicesFromNetwork(map, networklist[i]);
		list.push.apply(list, devicelist);
	}
	return list;
}

function getPartitions(map){
	var list = [];
	for(var partition in map){
		list.push(partition);
	}
}

function getDevicesFromNetwork(map, network_name){;
	partition = getPartition(map, network_name);
	//partition = getParent(map, network_name);
	var list = [];
	//console.log(partition);
	for(var key in map[partition][network_name]){
		list.push(key);
	}
	return list;
}

function getPartitionFromDevice(map, device_name){
	network_name=getNetwork(map,device_name);
	return getPartition(map,network_name);
}

function getNetwork(map, device_name){

	var list = getNetworks(map);
	var Network_name = '';
	for( var key in map ){
		for( var network in map[key]){
			if(map[key][network][device_name] !== null){
			
				Network_name = network;
			}
		}
	}
	return Network_name;
}

function getPartition(map, network_name){
	var Partition_name = '';
	console.log(map);
	for( var key in map ){
		for( var network in map[key]){
			if (network == network_name){
				var Partition_name = key;
				
			}
			//console.log(network + ' network name: ' + network_name);
		}
		
	}
	return Partition_name;
}



module.exports.getNetworksinPartition = getNetworksinPartition;
module.exports.getPartitions = getPartitions;
module.exports.getPartition = getPartition;
module.exports.getDevices = getDevices;
module.exports.getNetworks = getNetworks;
module.exports.getNetwork = getNetwork;
module.exports.getDevicesFromNetwork = getDevicesFromNetwork;