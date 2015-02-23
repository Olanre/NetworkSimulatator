/**
 * New node file
 */

	export.getPartition = function getPartition(){
		var partition = {};
		partition.partition_name = partitionName;
	}

	
	
	//Required
	exports = addNetwork = function(network){
	  deviceList.push(device);
	};
	
	exports.add2FreeList = function add2FreeList(simulation_name, device_name){
		Database.getSimByName(simulation, function(Sim){
			free_num = size(Sim.config_map['freelist']) + 1;
			Sim.config_map['freelist'][device_name] = free_num;
			

			Database.modifySimByName(simulation, Sim);
			
			Database.getDeviceByName( device_name, function(Device){
				Device.current_network = 'freelist';
				Device.current_partition = 'freelist';
				Database.modifyUserByName(device_name, Device);
			});
			
			
		});
	}
	
	exports.removeDevicefromFreeList = function removeDevicefromFreeList(simulation_name, device_name){
		Database.getSimByName(simulation, function(Sim){
			var list = Sim.config_map['freelist'];
			if( list.hasOwnProperty(device_name) ){
				delete Sim.config_map['freelist'][device_name];
			}

			Database.modifySimByName(simulation, Sim);
			
			
		});
	}
	
	exports.connectPartition = function mergePartition(partition_a, partition_b, simulation){
		Database.getSimByName(simulation, function(Sim){
			delete Sim.config_map[partition_b];
			Sim.config_map[partition_a] = merge_objects(Sim.config_map[partition_a],Sim.config_map[partition_b]);
			Database.modifySimByName(simulation, Sim);
		});
	}
	
	exports.disconnectPartition = function dividePartition(network, partition_name, simulation){
		Database.getSimByName(simulation, function(Sim){
			delete Sim.config_map[partiton][network];
			Sim.config_map[network] = network;
			Database.modifySimByName(simulation, Sim);
		});
	}
	
	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * from stackoverflow
	 * @param obj1
	 * @param obj2
	 * @returns obj1 based on obj1 and obj2
	 */
	function merge_objects(obj1,obj2){
	    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	    return obj1;
	}
	

