var Util=require("../Utilities/utilities.js");
var Network=require("./Network.js");
var Partition=require("./Partition.js");

function Simulation(simulation_name){

	//variables
	this.freeList = new Network.createNewNetwork('freelist','');
	this.partition_list = [];
	this.networkIterator = {};
	this.app = '';
	this.rdt = {};
	this.simulation_name=simulation_name;

	this.simulationJSON = {};
	this.simulationJSON.simulation_name = simulation_name;
	this.simulationJSON.partition_list=[];
	
	//admin.js stuff
	this.importRDT=importRDT;
	this.importApp=importApp;
	this.removeApp=removeApp;

	//functions
	this.getNetworks=getNetworks;
	this.add2FreeList=add2FreeList;
	this.removeDeviceFromFreeList=removeDeviceFromFreeList;
	this.getDevices=getDevices;
	this.addPartition=addPartition;
	this.addDevice=addDevice;
	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.mergePartitions=mergePartitions;
	this.attachJSON=attachJSON;
}

function createNewSimulation(simulation_name){
	var createdSimulation=new Simulation(simulation_name);
	//wrapper class should take care of this
	//Database.addSim(createdSimulation.simulationJSON);
	return createdSimulation;
}

function loadSimulationFromJSON(simulationJSON){

	var createdSimulation= new Simulation('');
	createdSimulation.attachJSON(simulationJSON);
	
	for(partitionName in simulationJSON.partition_list){
		var createdPartition=Partition.createNewPartition(partitionName,this.simulationJSON.simulation_name);
		this.partition_list.push(createdPartition);
	}
	
	return createdSimulation;
}

function attachJSON(simulationJSON){
		this.simulation_name=simulationJSON.simulation_name;
		this.simulationJSON=simulationJSON;
};

function importRDT(rdt){
		this.rdt = rdt;
}
	
function importApp(app){
		this.app = app;		
}
	
function removeApp(app){
		this.app = '';
}

function getNetworks(){
		var merged = [];
		for(var i = 0; i < this.partition_list.legnth; i++){
			var Networks = this.partition_list[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				merged = merged.concat.apply(merged, Networks[i]);
			}
							
		}
		
		return merged;
}

function getDevices(){
		var merged = [];
		for(var i = 0; i < this.simulationJSON.partition_list.legnth; i++){
			var Networks = this.simulationJSON.partition_list[i].networkList;
			for( var j = 0 ; j < Networks.length; j++){
				var Devices = Networks[i].networkJSON.device_list;
				for( var k = 0; k < Devices.length; k++){
					merged = merged.concat.apply(merged, Devices[i]);
				}
			}
							
		}
		return merged;
		
}

function addPartition(partition){
		
		this.partition_list.push(partition);
		this.simulationJSON.partition_list.push(partition.partitionJSON);
} 
	

function addDevice(device){
	device.deviceJSON.simulation_name = this.simulationJSON.simulation_name;
}

function addNetwork(network){

	var partition= Partition.createNewPartition();
	partition.addNetwork(network);
	this.partition_list.push(partition);
	this.simulationJSON.partition_list.push(partition.partitionJSON);

}

function removeNetwork(networkName){
		var networkList=this.getNetworks();

		for(index in networkList){
			if(networkList[index].network_name==networkName){
				for(devIndex in networkList[index].device_list){
					networkList[index].removeDevice(networkList[index].device_list[devIndex]);
				}
				networkList[index].partitionObject.removeNetwork(networkList[index]);
				networkList.splice(index,1);
			}
			break;
		}
		
}

function mergePartitions(partitionA,partitionB){
	for(index in this.partition_list){

		if(this.partition_list[index].partition_name==partitionB.partition_name){

			this.partition_list.splice(index,1);
			this.simulationJSON.partition_list.splice(index,1);

			partitionA.mergePartition(partitionB);

		}
	}
}


module.exports.createNewSimulation=createNewSimulation;
module.exports.loadSimulationFromJSON=loadSimulationFromJSON;
