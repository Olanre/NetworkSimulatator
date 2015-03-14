var Util=require("../Utilities/utilities.js");
var Network=require("./Network.js");
var Partition=require("./Partition.js");
var SimModel = require("../Database/dbModels/simulationModel.js");
var AppModel = require("../Database/dbModels/appModel.js");
var rdtModel = require("../Database/dbModels/RDTModel.js");
var NetworkIterator = require("./Iterators/NetworkIterator.js");
var DeviceIterator = require("./Iterators/DeviceIterator.js")

function Simulation(simulation_name){

	//variables
	
	this.partition_list = [];
	this.device_list=[];
	this.network_list=[];
	this.networkIterator = new NetworkIterator(this.network_list);
	this.deviceIterator = new DeviceIterator(this.device_list);
	this.apps = [];
	this.rdts = [];
	
	this.simulationJSON = {};
	
	
	//admin.js stuff
	this.importRDT=importRDT;
	this.importApp=importApp;
	this.removeApp=removeApp;

	//functions
	this.getNetworks=getNetworks;
	this.getDevices=getDevices;
	this.addPartition=addPartition;
	this.addDevice=addDevice;
	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.mergePartitions=mergePartitions;
	this.attachJSON=attachJSON;
	this.updateSimulationLog = updateSimulationLog;
}

function createNewSimulation(simulation_name){
	var createdSimulation = new Simulation(simulation_name);
	var simulationJSON = new SimModel();

	simulationJSON.simulation_name = simulation_name;
	simulationJSON.num_devices = 0;
	simulationJSON.num_networks = 0;
	simulationJSON.simulation_population = 0;
	simulationJSON.activity_logs = '';
	createdSimulation._id=simulationJSON._id;
	//simulationJSON.rdts = [];
	//simulationJSON.apps = [];

	createdSimulation.simulationJSON=simulationJSON;
	createdSimulation.attachJSON(simulationJSON);
	simulationJSON.save();
	return createdSimulation;
}

function loadSimulationFromJSON(simulationJSON){

	var createdSimulation= new Simulation('');
	createdSimulation.attachJSON(simulationJSON);
	
	for(index in simulationJSON.partition_list){
	
		var createdPartition=Partition.loadPartitionFromDatabase(simulationJSON.partition_list[index]);
		this.partition_list.push(createdPartition);


	}
	return createdSimulation;
}

function attachJSON(simulationJSON){
		this.simulation_name=simulationJSON.simulation_name;
		this.simulationJSON=simulationJSON;
		this._id=simulationJSON._id;
};

function importRDT(rdt){
		this.rdts.push(rdt);
		rdt.init( this.networkIterator, this.deviceIterator);
}
	
function importApp(app){
		this.apps.push(app);		
}
	
function removeApp(app){
		var index = apps.indexOf(app);
		if (index > -1) {
		    apps.splice(index, 1);
		}
}

function getNetworks(){
		var merged = [];
		for(var i = 0; i < this.partition_list.length; i++){

			var Networks = this.partition_list[i].network_list;

			for( var j = 0 ; j < Networks.length; j++){
				merged.push(Networks[j]);
			}
							
		}
		
		return merged;
}

function getDevices(){
		return this.device_list;
		
}

function addPartition(partition){
		
		this.partition_list.push(partition);
		this.simulationJSON.partition_list.push(partition.partitionJSON._id);
		this.simulationJSON.save();
} 
	

function addDevice(device){
	device.deviceJSON.simulation_name = this.simulationJSON.simulation_name;
	this.device_list.push(device);
	this.simulationJSON.num_devices++;
	device.deviceJSON.save();
	this.simulationJSON.save();
}

function addNetwork(network){

	var partition= Partition.createNewPartition(this.simulationJSON.simulation_name, network.network_name);
	partition.addNetwork(network);
	this.partition_list.push(partition);
	this.network_list.push(network);
	this.simulationJSON.partition_list.push(partition.partitionJSON._id);
	this.simulationJSON.num_networks++;
	this.simulationJSON.save();
}

function removeNetwork(network){
	var devices=network.device_list;
	for(device in devices){
		network.removeDevice(devices[device]);
	}
	network.partitionObject.removeNetwork(network);
	this.simulationJSON.num_networks--;
	this.simulationJSON.save();
		
}

function mergePartitions(partitionA,partitionB){
	for(index in this.partition_list){

		if(this.partition_list[index]._id==partitionB._id){

			this.partition_list.splice(index,1);
			this.simulationJSON.partition_list.splice(index,1);

			partitionA.mergePartition(partitionB);

		}
	}
	this.simulationJSON.save();
}

function updateSimulationLog(new_activity){
	this.simulationJSON.activity_logs += new_activity;
	this.simulationJSON.save();
}



module.exports.createNewSimulation=createNewSimulation;
module.exports.loadSimulationFromJSON=loadSimulationFromJSON;
