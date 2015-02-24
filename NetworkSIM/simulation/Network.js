var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Network(networkName, networkKind){
	//Required Variables//
	this.networkName = networkName; // String
	this.networkKind = networkKind; // Constant: WiFi, GSM
	//this.deviceIterator =new DeviceIterator(); // Returns an iterator that provides Device objects
		  
	//Our Variables//
	this.partition={};
	this.device_list=[];
	this.networkJSON=module.exports.getTemplate();
	this.simulationName='';
	this.networkJSON.network_name=networkName;
	this.networkJSON.network_type=networkKind;
	
	//Required Functions//
	this.addDevice=addDevice;
	this.removeDevice=removeDevice;
	this.connectNetwork=connectNetwork;
	this.disconnectNetwork=disconnectNetwork;
	
	//Our Functions//
	this.getJSON=getJSON;
}

function createNewNetwork(networkName,networkKind){
	var createdNetwork=new Network(networkName,networkKind);
	Database.saveNetwork(createdNetwork.networkJSON);
	return createdNetwork;
}

function loadNetworkFromJSON(networkJSON){
	var createdNetwork=new Network('','');
	attachJSON(createdNetwork,networkJSON);
	for(index in networkJSON.device_list){
		var createdDevice=Device.loadDeviceFromJSON(networkJSON.device_list[index]);
		createdDevice.networkObject=createdNetwork;
		this.device_list.push(createdDevice);
	}
	return createdNetwork;
	
}

function attachJSON(networkObject,networkJSON){
		networkObject.networkJSON=networkJSON;
		networkObject.networkName=networkJSON.network_name;
		networkObject.networkKind=networkJSON.network_kind;
		networkObject.partitionObject=networkJSON.partition;
		
}
function getJSON(){
	return Database.getNetworkByName(this.networkName);
}
	
	


//we assume that we will only add devices through a network
function addDevice(device){
		this.networkJSON.device_list.push(device.deviceJSON);
		this.device_list.push(device);
		Database.saveNetwork( this.networkJSON);
		device.joinNetwork(this);
};
	

function removeDevice(device){
		//delete from the device_list by token
		for (var i =0; i< this.device_list.length;i++){
			if (this.device_list[i].token == device.token){
				this.device_list.splice(1,i);//this should remove the element at index i
			}
		}
		//delete from the JSON device list
		for (var i =0; i< this.networkJSON.device_list.length;i++){
			if (this.networkJSON.device_list[i].token == device.token){
				this.networkJSON.device_list.splice(1,i);//this should remove the element at index i
			}
		}
		device.leaveNetwork(this);
		Database.saveNetwork( this.networkJSON);
};
	

function connectNetwork(network){
		this.partitionObject.mergePartitions(network.partitionObject);
		network.partitionObject=this.partitionObject;
		network.networkJSON.partition_name=this.partition_name;
		Database.modifyNetworkByName(network.network_name,networkJSON);
};

function disconnectNetwork(network){
		this.partitionObject.dividePartition(network)
		network.partitionObject={};
		Database.modifyNetworkByName(network.network_name,networkJSON);
};

function getTemplate(){
	var network_data={};
	network_data.network_name = '';
	network_data.network_type = '';
	network_data.partition = '';
	network_data.device_list = [];
	return network_data;
};
module.exports.createNewNetwork = createNewNetwork;
module.exports.loadNetworkFromJSON=loadNetworkFromJSON;
module.exports.getTemplate=getTemplate;