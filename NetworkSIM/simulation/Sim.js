
/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */
var deviceTemplate = require("./deviceTemplate.js");
var stateTemplate=require("./stateTemplate.js");

function Simulation(simulation_name){
	this.partitionList = [];
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
			if(this.partitionList[i].partition_name == partition.partition_name){
				this.partitionList[i] = partition;
				
				merged = merged.concat.apply(merged, partitionList[i].networkList);
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
	
	this.deleteDevice = function(device){
		
		//deviceList.spice(device);
		for(var i = 0; i < this.partitionList.length; i++ ){
			var Network = this.partitionList[i].networkList
			for(var j = 0; j < Network.networkList[j].deviceList.length; j++){
				var Device = Network.networkList[j].deviceList;
					var deviceIndex = Device[k].);
					if (deviceIndex != -1){
						networkList[i].deviceList.splice(device);
					}
				}
			}
		}
	
		
		var deviceIndex= this.NetworkList.deviceList.indexOf(network);
	}
	
	this.deleteNetwork = function(networkName){
		
	}
	
	this.deletePartition(partition){
		
	}
	
	this.addPartition = function(partitionName){
		var Partition = new Partition(partitionName);
		this.session_data.partitionList(Partition);
	}
	
	this.save = function(timestamp){
		
		Database.modifySimulationByName(this.simulation_name, this.simulationJSON);
	}
}

module.exports.getSimulationTemplate = getSimulationTemplate;/**
 * New node file
 */

