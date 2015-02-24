
/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */
var device = require("./device.js");
var state =require("./state.js");
var network = require("./network.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Simulation(simulation_name){
	this.freeList = new Network('freelist'); 
	this.partition_list = [];
	this.networkIterator = new NetworkIterator();
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
		for(var i = 0; i < this.partition_list.legnth; i++){
			var Networks = this.partition_list[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				merged = merged.concat.apply(merged, Networks[i]);
			}
							
			}
		}
		return merged;
	}

	this.add2FreeList = function(device){
		this.freeList.device_list.push(device);
		device.current_network = 'freelist';
		device.current_partition = 'freelist';
		
		var size = util.size(this.simulationJSON.config_map['freelist']);
		this.simulationJSON.config_map['freelist'][device.device_name] = size + 1;
		
		Database.getSimByName(this.simulationJSON.simulation_name , function(Sim){
			free_num = util.size(Sim.config_map['freelist']) + 1;
			Sim.config_map['freelist'][device.deviceJSON.current_device_name] = free_num;
			
			
			Database.modifySimByName(this.simulationJSON.simulation_name, Sim);
			
			Database.getDeviceByToken( device.deviceJSON.token, function(Device){
				Device.current_network = 'freelist';
				Device.current_partition = 'freelist';
				Database.modifyUserByToken(Device.token, device.deviceJSON);
			});
			
			
		});
	}
	
	this.removeDevicefromFreeList = function(device){
		
		
		var deviceIndex = this.freeList.device_list.indexOf(device)
		if( deviceIndex != -1){
			delete this.freeList.device_list[deviceIndex];
		}
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
			var list = Sim.config_map['freelist'];
			if( list.hasOwnProperty(device.deviceJSON.current_device_name) ){
				delete Sim.config_map['freelist'][device.deviceJSON.current_device_name];
			}

			Database.modifySimByName(this.simulationJSON.simulation_name, Sim);
			
			
		});
		
	}
	
	this.getDevices = function(){
		var merged = [];
		//merge the javascript objects
		for(var i = 0; i < this.partitionJSON.partition_list.legnth; i++){
			var Networks = this.partitionJSON.partition_list[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				var Devices = Networks[i].networkJSON.device_list;
				for( var k = 0; k < Devices.length; k++){
					merged = merged.concat.apply(merged, Devices[i]);
				}
			}
							
		}
		
		
	}
	
	this.addPartition = function(partitionName, simulationName){
		var Partition = new Partition(partitionName, simulationName);
		this.partition_list.push(Partition);
		
		partitonJSON = Partition.getPartition(); 
		this.simulationJSON.partition_list.push(Partition);
		
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
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
		
		for(var i = 0; i < this.simulationJSON.partitionList.length; i++){
			if(this.simulationJSON.partitionList[i].partition_name == partition.partitionJSON.partition_name){
				this.simulationJSON.partitionList[i] = partition.partitionJSON.partition_name;
			}
		}
		
		
	}
	this.addDevice = function(deviceName){
		var d = new Date();
		var Device = new Device(deviceName);
		var deviceTemplate = Device.getTemplate();
		
		Device.current_simulation = this.simulation_name;
		Device.email = deviceName;
		device.current_device_name = deviceName;
		device.registeredOn = d.toString();
		//use the partitionList or config map
		Device.loadJSON(deviceTemplate);
		Device.deviceJSON.current simulation = this.simulation_name;
		Device.deviceJSON.email = deviceName;
		Device.deviceJSON.current_device_name = deviceName;
		Device.deviceJSON.registeredOn = d.toString();
		
		
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
			
			Sim.num_devices += 1;
			Database.getApplication(function(App){
				App.total_devices += 1;
				Database.modifySimByName(this.simulation_name, Sim);
				this.add2FreeList(Device);
			});
			
			
		});
		
		//Simulation.addDevice()
	  // Add a device with the given name to the simulation
	}
	
	this.addNetwork = function(networkName, networkType){
		var Network = new Network(networkName, networkType);
		var Partition = new Partition(networkName);
		Partition.addNetwork(Network);
		this.partition_list.push(Partition);
		//use the partitionList or config map
		partitonJSON = Partition.getTemplate(); 
		networkJSON = Network.getTemplate();
		partitionJSON.network_list.push(networkJSON);
		this.simulationJSON.partition_list.push(partitionJSON);
		
		Database.getSimByName(this.simulationJSON.simulation_name, function(Sim){
			//this.simulationJSON.partition_list.push(partitionJSON);
			Sim.config_map[networkName][networkName] = {};
			Sim.num_network += 1;

			Database.modifySimByName(this.simulation_name, Sim);
			
			
		});
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
							if (deviceIndex != -1){
								this.partitionList[i].networkList[j].deviceList.splice(deviceIndex, 1);
							}
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
		//use the partitionList or config map
		for(var i = 0; i < this.partitionJSON.partitionList.length; i++ ){
			var Networks = this.partitionJSON.partitionList[i].networkList
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
	
	
	this.save = function(state){
		Database.modifySimulationByName(this.simulation_name, this.simulationJSON);
		Database.saveState(state);
	}
}
module.exports.getTemplate=function(){
	var session_data = {};
	//session_data.partition_list = [];
	session_data.num_devices=0;
	session_data.num_networks=0;
	session_data.simulation_population = 0;
	session_data.simulation_name = simulation_name;
	session_data.config_map = {};
	session_data.tokenMethod = 0;
	session_data.activity_logs = '';
	return session_data;
	
};
module.exports.Simulation = Simulation;
