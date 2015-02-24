
/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */
var device = require("./device.js");
var state =require("./state.js");
var network = require("./network.js");

function Simulation(simulation_name){
	this.freeList = new Network('freelist'); 
	this.partitionList = [];
	this.networkIterator = new NetworkIterator();
	this.networkList = [];
	this.deviceList = [];
	this.simulation_name = simulation_name;
	this.simulationJSON = {};
	this.app = '';
	this.rdt = {};
	
	this.attachJSON=function(simulationJSON){
		this.simulationJSON=simulationJSON;
		this.simulation_name = simulationJSON.simulation_name;
		this.activity_logs = simulationJSON.activity_logs;
		this.partitionList = simulationJSON.partition_list;
		
	};
	
	this.getSimulation(){
		var session_data = {};
		session_data.partitionList = [];
		session_data.simulation_name = simulation_name;
		session_data.simulation_population = 0;
		session_data.activity_logs = '';
		session_data.tokenMethod = '';
		session_data.globalcount = 0;
		session_data.config_map = {};
		return session_data;
		
	}
	this.getJSON = function(){
		 
		return this.simulationJSON;
	}
	
	this.importRDT = function(rdt){
		this.rdt = rdt;
	}
	
	this.importApp = function(app){
		this.app = app;
		
	}
	
	this.removeApp = function(app){
		this.app = '';
	}
	
	this.getNetworks = function(){
		var merged = [];
		for(var i = 0; i < this.partitionList.legnth; i++){
			var Networks = this.partitionList[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				merged = merged.concat.apply(merged, Networks[i]);
			}
							
			}
		}
		return merged;
	}

	this.add2FreeList = function(device){
		this.freeList.addDevice(device);
		Database.getSimByName(simulation, function(Sim){
			free_num = size(Sim.config_map['freelist']) + 1;
			Sim.config_map['freelist'][device.current_device_name] = free_num;
			
			Device.joinNetwork(this.freeList);
			Database.modifySimByName(this.simulation_name, Sim);
			
			Database.getDeviceByToken( device.token, function(Device){
				Device.current_network = 'freelist';
				Device.current_partition = 'freelist';
				Database.modifyUserByToken(device.token, device.deviceJSON);
			});
			
			
		});
	}
	
	this.removeDevicefromFreeList = function(device){
		
		Database.getSimByName(this.simulation, function(Sim){
			var list = Sim.config_map['freelist'];
			if( list.hasOwnProperty(device.current_device_name) ){
				delete Sim.config_map['freelist'][device_name];
			}

			Database.modifySimByName(this.simulation_name, Sim);
			
			
		});
		
	}
	
	this.getDevices = function(){
		var merged = [];
		for(var i = 0; i < this.partitionList.legnth; i++){
			var Networks = this.partitionList[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				var Devices = Networks[i].deviceList;
				for( var k = 0; k < Devices.length; k++){
					merged = merged.concat.apply(merged, Devices[i]);
				}
			}
							
		}
		return merged;
	}
	
	this.addPartition = function(partitionName, simulationName){
		var Partition = new Partition(partitionName, simulationName);
		this.partitionList.push(Partition);
		partitonJSON = Partition.getPartition(); 
		Database.getSimByName(this.simulation, function(Sim){
			Sim.partitionList.push(partitionJSON);

			Database.modifySimByName(this.simulation_name, Sim);
			
			
		});
	} 
	
	
	this.modifyPartition = function(partition){
		for(var i = 0; i < this.partitionList.length; i++){
			if(this.partitionList[i].partition_name == partition.partition_name){
				this.partitionList[i] = partition;
			}
		}
		
		
	}
	this.addDevice = function(deviceName){
		var Device = new Device(deviceName);
		this.add2FreeList(Device);
		//Simulation.addDevice()
	  // Add a device with the given name to the simulation
	}
	
	this.addNetwork = function(networkName, networkType){
		var Network = new Network(networkName, networkType);
		var Partition = new Partition(networkName);
	}
	
	this.removeDevice = function(deviceName){
		
		//deviceList.spice(device);
		for(var i = 0; i < this.partitionList.length; i++ ){
			var Networks = this.partitionList[i].networkList;
			for(var j = 0; j < Networks.length; j++){
				var Devices = Networks[j].deviceList;
					for( var k = 0; k < Devices.length; k++){
						if(Devices[k].current_device_name == deviceName){
							var deviceIndex = k;
							this.partitionList[i].networkList[j].deviceList.splice(deviceIndex, 1);
							
						}
						if (deviceIndex != -1){
							
						}
					}
					var deviceIndex = Devices.indexOf(device););
					
				}
			}
			Database.getSimByName(this.simulation_name, function(Sim){
				var list = Sim.config_map['freelist'];
				if( list.hasOwnProperty(device_name) ){
					delete Sim.config_map['freelist'][device_name];
				}else{
					delete Sim.config_map[partition][network][device_name];
				}
				//need to update number of devices here for application and simulation
				Database.modifySimByName(this.simulation_name, Sim);
			});
	
		
	}
	
	this.removeNetwork = function(networkName){
		//deviceList.spice(device);
		for(var i = 0; i < this.partitionList.length; i++ ){
			var Networks = this.partitionList[i].networkList
			for(var j = 0; j < Networks.length; j++){
				if(Networks[j].network_name == networkName){
					var networkIndex = j; 
					this.partitionList[i].networkList.splice(Networks[j], 1);
				}
					
			}
		}
		
	}
	
	this.deletePartition(partition){
		var partitionIndex = partitionList.indexOf(partition);
		if(partitionIndex != null){
			delete partitionList(partitionIndex);
		}
	}
	
	this.addPartition = function(partitionName){
		var Partition = new Partition(partitionName);
		this.session_data.partitionList.push(Partition);
	}
	
	this.save = function(state){
		Database.modifySimulationByName(this.simulation_name, this.simulationJSON);
		Database.saveState(state);
	}
}

module.exports.getSimulationTemplate = getSimulationTemplate;
/**
 * New node file
 */

