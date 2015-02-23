var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Partition(partitionName){
	
	this.partition_name=partitionName;
	this.networks=[];
	this.partitionJSON={};
	
	this.getTemplate=function(){
		var partitionTemplate={};
		partitionTemplate.partition_name="";
		partitionTemplate.network_list=[];
		return partitionTemplate;
	}
	
	this.attachJSON(partitionJSON){
		var networkObject;
		this.partitionJSON=partitionJSON;
		
		for(network in partitionJSON.network_list){
			networkObject=new Network(network.name);
			network.atttachJSON(partitionJSON.network_list[network]);
		}
		
	}

	this.addNetwork=function(network){
		
		Database.getSimulationByName(this.partitionJSON.simulation_name,function(simulation){
			simulation.config_map[this.partition_name][network.network_name]=network.networkJSON.device_list;
			Database.modifySimByName(simulation.simulation_name,simulation,function(){});
		});
		networks.push(network);
	};
	
	this.removeNetwork=function(network){
		Database.getSimulationByName(this.partitionJSON.simulation_name,function(simulation){
			delete simulation.config_map[this.partition_name][network.network_name];
			Database.modifySimByName(simulation.simulation_name,simulation,function(){});
		});
		delete networks[networks.indexOf(network)];
	};
	
}