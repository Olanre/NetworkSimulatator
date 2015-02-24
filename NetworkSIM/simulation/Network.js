var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Network(networkName, networkType){
	//Required
	this.networkName = networkName; // String
	//Required
	this.networkKind = networkKind; // Constant: WiFi, GSM
	//Required
	this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
		  
	this.partition={};
	this.device_list=[];
	this.networkJSON={};
	this.simulationName='';
	
	this.attachJSON=function(networkJSON){
		this.networkJSON=networkJSON;
	}
	
	
	//Required
	
	//we assume that we will only add devices through a network
	this.addDevice = function addDevice(device){
		this.networkJSON.device_list.push(device.deviceJSON);
		this.device_list.push(device);
		//need this function from andrew
		Database.saveNetwork( this.networkJSON);
		device.joinNetwork(this);
	};
	
	//Required
	this.removeDevice= function(device){
		//delete from the device_list by token
		for (var i =0; i< this.device_list.length){
			if (this.device_list[i].token == device.token){
				this.device_list.splice(1,i);//this should remove the element at index i
			}
		}
		//delete from the JSON device list
		for (var i =0; i< this.networkJSON.device_list.length){
			if (this.networkJSON.device_list[i].token == device.token){
				this.networkJSON.device_list.splice(1,i);//this should remove the element at index i
			}
		}
		device.leaveNetwork(this);
		Database.saveNetwork( this.networkJSON);
	};
	
	//Required
	this.connectNetwork = function (network){
		this.partition.mergePartitions(network.partition);
		network.partition=this.partition;
		network.networkJSON.partition_name=this.partition_name;
		Database.modifyNetworkByName(network.network_name,networkJSON);
	};
	//Required
	this.disconnectNetwork = function(network){
		this.partition.dividePartition(network)
		network.partition={};
		Database.modifyNetworkByName(network.network_name,networkJSON);
	};

};
module.exports.getTemplate= function(){
	network_data.network_name = networkName;
	network_data.network_type = networkType;
	network_data.partition = '';
	network_data.device_list = [];
	return network_data;
};
module.exports.Network = Network;