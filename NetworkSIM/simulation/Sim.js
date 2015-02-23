
/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */
var deviceTemplate = require("./deviceTemplate.js");
var stateTemplate=require("./stateTemplate.js");

function Simulation(simulation_name){
	this.freeList = new Network('freelist'); 
	this.partitionList = [];
	this.networkIterator = new NetworkIterator();
	this.networkList = networkList;
	this.deviceList = deviceList;
	this.simulation_name = simulation_name;
	this.simulationJSON = {};
	this.activity_logs = '';
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
		for(var i = 0; i < this.partitionList.legnth; i++){
			var Networks = this.partitionList[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				merged = merged.concat.apply(merged, Networks[i]);
			}
							
			}
		}
		return merged;
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
	
	this.addPartition = function(partitionName){
		var Partition = new Partition(partitionName);
		this.partitionList.push(Partition);
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
		for(var i = 0; i < this.partitionList.length; i++){
			if( partitionList[i].partition_name == 'freelist'){
				freelist.addDevice(Device);
			}
		}
		//Simulation.addDevice()
	  // Add a device with the given name to the simulation
	}
	
	this.addNetwork = function(networkName, networkType){
		var Network = new Network(networkName, networkType);
		var Partition = new Partition(networkName);
	}
	
	this.deleteDevice = function(deviceName){
		
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
		}
	
		
	}
	
	this.deleteNetwork = function(network){
		//deviceList.spice(device);
		for(var i = 0; i < this.partitionList.length; i++ ){
			var Networks = this.partitionList[i].networkList
			for(var j = 0; j < Networks.length; j++){
				var Devices = Networks[j].deviceList;
					var deviceIndex = Devices.indexOf(device););
					if (deviceIndex != -1){
						this.partitionList[i].networkList[j].deviceList.splice(deviceIndex, 1);
					}
				}
			}
		}
	}
	
	this.deletePartition(partition){
		for(var i = 0; i < this.partitionList.length; i++ ){
	}
	
	this.addPartition = function(partitionName){
		var Partition = new Partition(partitionName);
		this.session_data.partitionList(Partition);
	}
	
	this.save = function(timestamp){
		
		Database.modifySimulationByName(this.simulation_name, this.simulationJSON);
	}
}

module.exports.getSimulationTemplate = getSimulationTemplate;
/**
 * New node file
 */

