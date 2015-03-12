var Util=require("../Utilities/utilities.js");
var Database=require("../Database/mongooseConnect.js");
var PModel = require("../Database/dbModels/partitionModel.js");
var NetworkIterator=require('./Iterators/NetworkIterator.js');

function Partition(partitionName, simulationName){
	//Variables
	this.partition_name=partitionName;
	this.simulation_name=simulationName;
	this.network_list=[];
	this.NetworkIterator = new NetworkIterator(this.network_list);

	//Functions
	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.mergePartitions=mergePartitions;
	this.attachJSON=attachJSON;

	//Constructor contents
	this.partitionJSON = {};
	

}

function createNewPartition(partitionName,simulationName){
	var createdPartition=new Partition(partitionName, simulationName);
	var partitionJSON = new PModel();
	createdPartition.attachJSON(partitionJSON);
	partitionJSON.save();
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
		this._id=partitionJSON._id;
}

function addNetwork(network){
		network.partitionObject=this;
		this.network_list.push(network);
		this.partitionJSON.network_list.push(network.networkJSON._id);
}

function removeNetwork(network){

	for(index in this.network_list){
		if(this.network_list[index]==network){

			network.partitionObject=createNewPartition();
			network.networkJSON.partition_name='';
			this.network_list.splice(index,1);
			this.partitionJSON.network_list.splice(index,1);
			
		}
	}
}

function mergePartitions(partition){
		var networks=partition.network_list;
		for(key in networks){
			networks[key].partitionObject=this;
			networks[key].networkJSON.partition_name=this.partition_name;
			this.partitionJSON.network_list.push(networks[key]._id);
			this.network_list.push(partition.network_list[key]);
		}
};

module.exports.createNewPartition = createNewPartition;
module.exports.loadPartitionFromJSON=loadPartitionFromJSON;