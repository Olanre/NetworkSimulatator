var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Partition(partitionName, simulationName){
	
	this.partition_name=partitionName;
	this.simulation_name=simulationName;
	this.networks=[];
	this.partitionJSON=getTemplate();
	this.partitionJSON.simulation_name=simulation_name;
	this.partitionJSON.network_list=[];
	
	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.mergePartitions=mergePartitions;
	this.dividePartition=dividePartition;
	
}

function createNewPartition(partitionName,simulationName){
	var createdPartition=new Partition(partitionName, simulationName);
	return createdPartition;
}

function createPartitionFromJSON(partitionJSON){
	var createdPartition=new Partition('','');
	attachJSON(createdPartition,partitionJSON);
	return createdPartition;
}

function attachJSON(partitionObject,partitionJSON){
		partitionObject.partitionJSON=partitionJSON;		
}
function getJSON(){
		return Database.getPartitionByName(this.partition_name);
}
	
function addNetwork(network){
		
		Database.getSimulationByName(this.simulation_name,function(simulation){
			simulation.config_map[this.partition_name][network.network_name]=network.networkJSON.device_list;
			Database.modifySimByName(simulation.simulation_name,simulation,function(){});
		});
		networks.push(network);
}

function removeNetwork(network){
		Database.getSimulationByName(this.simulation_name,function(simulation){
			delete simulation.config_map[this.partition_name][network.network_name];
			Database.modifySimByName(simulation.simulation_name,simulation,function(){});
		});
		delete networks[networks.indexOf(network)];
}

function mergePartitions(partition){
		//updates the configmap and the partition in the database
		Database.getSimByName(this.simulation_name,function(simulation){
			var partitionb=simulation.config_map[partition.partition_name]
			delete simulation.config_map[partition.partition_name];
			sim.config_map[this.partition_name]=Util.merge_objects(sim.config_map[this.partition_name],partitionb);
			Database.modifySimByName(this.simulation_name, simulation);
			Database.modifyPartitionByName(this.partition_name, this.partitionJSON);
			
			
		});
		//updates the partition object and the network object
		for(network in partition.networks){
			network.partition=this;
			this.networks.push(partition.networks[network]);
		}
};

function dividePartition(network){
		//updates the configmap and the partition in the database
		Database.getSimByName(this.simulation_name,function(simulation){
			delete Sim.config_map[this.partition_name][network.network_name];
			simulation.config_map[network.network_name]=network.networkJSON;
			Database.modifySimByName(this.simulation_name,simulation);
			Database.modifyPartitionByName(this.partition_name,this.partitionJSON);
			
		});
		//updates the partition object and the network object
		delete this.networks[this.networks.indexOf(network)];
		network.partition={};
};
module.exports.getTemplate=function(){
	var partitionTemplate={};
	partitionTemplate.partition_name="";
	partitionTemplate.network_list=[];
	return partitionTemplate;
}
module.exports.createNewPartition = createNewPartition;
module.exports.createPartitionFromJSON=createPartitionFromJSON;