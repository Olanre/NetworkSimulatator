var Util=require("./utilities.js");

function Partition(partitionName, simulationName){
	
	this.partition_name=partitionName;
	this.simulation_name=simulationName;
	this.network_list=[];
	this.partitionJSON=module.exports.getTemplate();
	this.partitionJSON.partition_name=partitionName;
	this.partitionJSON.network_list=[];

	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.mergePartitions=mergePartitions;
	this.attachJSON=attachJSON;
	
}

function createNewPartition(partitionName,simulationName){
	var createdPartition=new Partition(partitionName, simulationName);
	//Wrapper class will handle this
	//Database.savePartition(createdPartition.partitionJSON);
	return createdPartition;
}

function loadPartitionFromJSON(partitionJSON){
	var createdPartition=new Partition('','');
	attachJSON(createdPartition,partitionJSON);
	for(var i=0;i<partitionJSON.network_list.length;i++){
			var createdNetwork=Network.loadNetworkFromJSON(partitionJSON.network_list[i]);
			createdPartition.addNetwork(cratedNetwork);
	};

		return createdPartition;
}


function attachJSON(partitionJSON){
		this.partitionJSON=partitionJSON;
		this.partition_name=partitionJSON.partition_name;
}

function addNetwork(network){
		network.partitionObject=this;
		this.network_list.push(network);
		this.partitionJSON.network_list.push(network.networkJSON);
}

function removeNetwork(network){

	for(index in this.network_list){
		if(this.network_list[index]==network){
			network.partitionObject={};
			network.networkJSON.partition='';
			this.network_list.splice(index,1);
			this.networkJSON.network_list.splice(index,1);
		}
	}
}

function mergePartitions(partition){

		for(network in partition.network_list){
			network.partition=this;
			network.networkJSON.partition_name=this.networkJSON.partition_name;
			this.partitionJSON.network_list.push(network.networkJSON);
			this.network_list.push(partition.network_list[network]);
		}
};

module.exports.createNewPartition = createNewPartition;
module.exports.loadPartitionFromJSON=loadPartitionFromJSON;