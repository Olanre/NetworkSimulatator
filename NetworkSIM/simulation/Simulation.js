var Util=require("./utilities.js");

function Simulation(simulation_name){

	//variables
	this.freeList = new Network.createNewNetwork('freelist','');
	this.partition_list = [];
	this.networkIterator = {};
	this.app = '';
	this.rdt = {};

	this.simulationJSON = {};
	this.simulationJSON.simulation_name = simulation_name;
	this.simulationJSON.simulation_name = this.simulation_name;
	
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
	attachJSON(simulationJSON);
	
	for(partitionName in simulationJSON.partition_list){
		var createdPartition=Partition.createNewPartition(partitionName,this.simulationJSON.simulation_name);
		this.partition_list.push(createdPartition);
	}
	
	return createdSimulation;
}

function attachJSON(simulationJSON){
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

function add2FreeList(device){
		this.freeList.device_list.push(device);
		device.current_network = 'freelist';
		device.current_partition = 'freelist';
		var size = util.size(this.simulationJSON.partition_list['freelist']);
		this.simulationJSON.partition_list['freelist'][device.device_name] = size + 1;	
		var free_num = util.size(Sim.partition_list['freelist']) + 1;
		this.simulationJSON.partition_list['freelist'][device.deviceJSON.current_device_name] = free_num;
		device.networkObject = this.freelist;
		device.deviceJSON.current_network='freelist';
		device.partition={};
	
}

function removeDeviceFromFreeList(device){
		
		var deviceIndex = this.freeList.device_list.indexOf(device);
		if( deviceIndex != -1){
			delete this.freeList.device_list[deviceIndex];
		}
		
		var list = this.simulationJSON.partition_list['freelist'];
		if( list.hasOwnProperty(device.deviceJSON.current_device_name) ){
			delete this.simulationJSON.partition_list['freelist'][device.deviceJSON.current_device_name];
		}		
		
}

function getDevices(){
		var merged = [];
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

function addPartition(partition){
		
		this.partition_list.push(partition);

		partitonJSON = newPartition.partitionJSON; 
		this.simulationJSON.partition_list.push(partitionJSON);
} 
	

function addDevice(device){
	device.deviceJSON.simulation_name = this.simulationJSON.simulation_name;
	this.freeList.addDevice(device);
}

function addNetwork(network){

	var partition= Partition.createNewPartition(tokenManager.generateToken(),this.simulationJSON.simulation_name);
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

module.exports.createNewSimulation=createNewSimulation;
module.exports.loadSimulationFromJSON=loadSimulationFromJSON;
