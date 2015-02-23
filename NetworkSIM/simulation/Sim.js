
/**
 * session_data holds all of the variables related to the current simulation if one exists.
 * This is the template for a simulation.
 */
var deviceTemplate = require("./deviceTemplate.js");
var stateTemplate=require("./stateTemplate.js");

function Simulation(simulation_name){
	this.deviceList = [];
	this.networkList = [];
	this.partitionList = [];
	this.simulation_population = 0;
	this.simulation_name = simulation_name;
	this.config_map = {};
	this.freelist = {};
	this.tokenMethod = '';
	this.globalcount = 0;
	this.activity_logs = '';
	
	this.getSimulation = function(){
		 
		return session_data;
	}
	
	this.addNetwork = function(networkName, networkType){
		var Network = new Network(networkName, networkType);
		this.session_data.networkList.push(Network);
		
	}
	
	
	this.addDevice = function(deviceName){
		var Device = new deviceTemplate.Device(deviceName);
		this.deviceList.push(Device);
	}
	
	this.addPartition = function(partitionName){
		var Partition = new Partition(partitionName);
		this.partitionList.push(Partition);
	} 
	
	this.deleteDevice = function(device){
		
		var deviceIndex = deviceList.indexOf(device);
		deviceList.spice(device);
		for(var i = 0; i < networkList.length; i++ ){
			for(var i = 0; i < networkList[i].deviceList.length; i++){
				var deviceIndex = networkList[i].deviceList.indexOf(device);
				if (deviceIndex != -1){
					networkList[i].deviceList.splice(device);
				}
			}
		}
		var deviceIndex= this.NetworkList.deviceList.indexOf(network);
	}
	
	this.deleteNetwork = function(networkName){
		
	}
	
	this.addPartition = function(partitionName){
		var Partition = new Partition(partitionName);
		this.session_data.partitionList(Partition);
	}
	
	this.save = function(){
		var sim = {};
		sim.deviceList = this.deviceList;
		sim. = this.networkList ;
		sim.partitionList = this.partitionList;
		sim.simulation_population = this.simulation_population;
		sim.simulation_name = this.simulation_name = simulation_name;
		sim.config_map = this.config_map;
		sim.tokenMethod = this.tokenMethod;
		sim.globalCount = this.globalcount=;
		sim.activity_logs = this.activity_logs;
		Database.modifySimulationByName(this.simulation_name, sim);
	}
}

module.exports.getSimulationTemplate = getSimulationTemplate;/**
 * New node file
 */

