function Network(networkName, networkType){
	var network_data = {};
	
	exports.getNetwork = function getNetwork(){
		network_data.network_name = networkName;
		network_data.network_type = networkType;
		network_data.deviceList = [];
		return network_data;
	}
	
	//Required
	exports.addDevice = function addDevice(device, network, partition, simulation){
		Database.getSimByName(simulation, function(Sim){
			var list.Sim.config_map['freelist'];
			if( list.hasOwnProperty(device) ){
				delete Sim.config_map.free_list[device];
		  	}
			device_num = size(local_session.config_map[Partition_name][network_name]) + 1;
			//add the device to the actual configuration map
			Sim.config_map[partition][network][device] = device_num;
			Database.modifySimByName(simulation, Sim);
			Database.getDeviceByName( device, function(Device){
				Device.current_network = network;
				Device.current_partition = partition;
				Database.modifyUserByName(device_name, Device);
			});
			
		}
	};
	
	//Required
	exports = removeDevice = function(device, network, simulation, partition){
		Database.getSimByName(simulation, function(Sim){
			if(Sim !== null){
				delete Sim.config_map[partition][network][device_name];
				Database.modifySimByName(simulation, Sim);
				var Partition = partitionTemplate.addDevice2FreeList(device);
			}
		});
	};
	//Required
	exports = connectNetwork = function(networka, networkb simulation){
		Database.getSimByName(simulation, function(Sim){
			var partitiona = simulation.getPartition(Sim.config_map, networka);
			var partitionb = simulation.getPartition(Sim.config_map, networkb);
			var devices = Sim.config_map[partitionb][networkb];
			delete Sim.config_map[partitionb][network];
			Sim.config_map[partitiona][networkb] = devices;
			
			Database.modifySimByName(simulation, Sim);
		});
	};
	//Required
	exports.disconnectNetwork = function dividePartition(network, partition_name, simulation){
		Database.getSimByName(simulation, function(Sim){
			delete Sim.config_map[partiton][network];
			Sim.config_map[network] = network;
			Database.modifySimByName(simulation, Sim);
		});
	}
	
	function size(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
}