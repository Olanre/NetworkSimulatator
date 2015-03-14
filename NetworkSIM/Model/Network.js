var Util=require("../Utilities/utilities.js");
var Partition= require('./Partition.js');
var NetModel = require("../Database/dbModels/networkModel.js");
var DeviceIterator=require('./Iterators/DeviceIterator.js');

function Network(networkName, networkKind){

	//Required Variables//
	this.networkName = networkName; // String
	this.networkKind = networkKind; // Constant: WiFi, GSM
	this.deviceIterator ={};// Returns an iterator that provides Device objects
		  
	//Our Variables//
	this.partitionObject=Partition.createNewPartition('','');
	this.device_list=[];
	this.networkJSON={};

	//Required Functions//
	this.addDevice=addDevice;
	this.removeDevice=removeDevice;
	this.connectNetwork=connectNetwork;
	this.disconnectNetwork=disconnectNetwork;
	
	//Our Functions//
	this.attachJSON = attachJSON;

	//Constructor contents

	this.deviceIterator = new DeviceIterator(this.device_list);
}

function createNewNetwork(networkName,networkKind){
	var createdNetwork = new Network(networkName,networkKind);
	var networkJSON =  new NetModel();

	networkJSON.network_type=networkKind;
	networkJSON.network_name=networkName;
	networkJSON.partition_name = '';
	createdNetwork._id=networkJSON._id;
	createdNetwork.networkJSON=networkJSON;
	createdNetwork.attachJSON(networkJSON);

	createdNetwork.partitionObject.addNetwork(createdNetwork);
	networkJSON.save();

	return createdNetwork;
}

function loadNetworkFromJSON(networkJSON){
	var createdNetwork=new Network('','');
	createdNetwork.attachJSON(networkJSON);
	for(index in networkJSON.device_list){
		var createdDevice=Device.loadDeviceFromJSON(networkJSON.device_list[index]);
		createdNetwork.addDevice(createdDevice);
	}
	return createdNetwork;
}

function attachJSON(networkJSON){
		this.networkJSON=networkJSON;
		this.networkName=networkJSON.network_name;
		this.networkKind=networkJSON.network_type;
		this._id=networkJSON._id;
}

//we assume that we will only add devices through a network
function addDevice(device){
		this.networkJSON.device_list.push(device.deviceJSON._id);
		this.device_list.push(device);
		device.joinNetwork(this);
		this.networkJSON.save();
};
//we assume that we will only remove devices through a network
function removeDevice(device){
		for (var i =0; i< this.device_list.length;i++){
			if (this.device_list[i].token == device.token){
				this.device_list.splice(i,1);
				break;
			}
		}
		//delete from the JSON device list
		for (var i =0; i< this.networkJSON.device_list.length;i++){
			if (this.networkJSON.device_list[i] == device.deviceJSON._id){
				this.networkJSON.device_list.splice(i,1);
				break;
			}
		}

		device.leaveNetwork(this);
		this.networkJSON.save();
};

function connectNetwork(network){
		this.partitionObject.mergePartitions(network.partitionObject);
		network.partitionObject=this.partitionObject;
		network.networkJSON.partition_name=this.networkJSON.partition_name;
		this.networkJSON.save();
};

function disconnectNetwork(network){
		this.partitionObject.removeNetwork(network);
		this.networkJSON.save();
};

module.exports.createNewNetwork = createNewNetwork;
module.exports.loadNetworkFromJSON=loadNetworkFromJSON;