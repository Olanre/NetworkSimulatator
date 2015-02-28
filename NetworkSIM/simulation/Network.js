var Util=require("./utilities.js");

function Network(networkName, networkKind, partitionName){
	//Required Variables//
	this.networkName = networkName; // String
	this.networkKind = networkKind; // Constant: WiFi, GSM
	this.deviceIterator =new DeviceIterator(); // Returns an iterator that provides Device objects
		  
	//Our Variables//
	this.partitionObject={};
	this.device_list=[];
	this.networkJSON={};

	this.networkJSON.network_name=networkName;
	this.networkJSON.network_type=networkKind;
	this.networkJSON.partition_name = partitionName;

	this.deviceIterator=new DeviceIterator(device_list);

	//Required Functions//
	this.addDevice=addDevice;
	this.removeDevice=removeDevice;
	this.connectNetwork=connectNetwork;
	this.disconnectNetwork=disconnectNetwork;
	
	//Our Functions//
	this.attachJSON=attachJSON;
}

function createNewNetwork(networkName,networkKind, partitionName){
	var createdNetwork=new Network(networkName,networkKind, partitionName);
	//wrapper class will be responsible for this.
	//Database.saveNetwork(createdNetwork.networkJSON);
	return createdNetwork;
}

function loadNetworkFromJSON(networkJSON){
	var createdNetwork=new Network('','');
	attachJSON(createdNetwork,networkJSON);
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
}

//we assume that we will only add devices through a network
function addDevice(device){
		this.networkJSON.device_list.push(device.deviceJSON);
		this.device_list.push(device);
		device.joinNetwork(this);
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
			if (this.networkJSON.device_list[i].token == device.token){
				this.networkJSON.device_list.splice(i,1);//this should remove the element at index i
				break;
			}
		}

		device.leaveNetwork(this);
};

function connectNetwork(network){
		this.partitionObject.mergePartitions(network.partitionObject);
		network.partitionObject=this.partitionObject;
		network.networkJSON.partition_name=this.networkJSON.partition_name;
};

function disconnectNetwork(network){
		this.partitionObject.removeNetwork(network);
		network.partitionObject={};
		network.networkJSON.partition_name="";
};

module.exports.createNewNetwork = createNewNetwork;
module.exports.loadNetworkFromJSON=loadNetworkFromJSON;