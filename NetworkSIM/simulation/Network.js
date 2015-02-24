var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");
function Network(networkName, networkKind){
	//Required
	this.networkName = networkName; // String
	//Required
	this.networkKind = networkKind; // Constant: WiFi, GSM
	//Required
	//this.deviceIterator =new DeviceIterator(); // Returns an iterator that provides Device objects
		  
	this.partition={};
	this.device_list=[];
	this.networkJSON=module.exports.getTemplate();
	this.simulationName='';
	
	this.attachJSON=function(networkJSON){
		this.networkJSON=networkJSON;
		this.networkName=networkJSON.network_name;
		this.networkKind=networkJSON.network_kind;
		this.partition=networkJSON.partition;
		
		for(deviceName in networkJSON.device_list){
			var createdDevice=new Device.device(deviceName);
			Database.addUser(createdDevice.deviceJSON);
			createdDevice.joinNetwork(this);
			this.device_list.push(createdDevice);
		}
	}
	this.getJSON=function(){
		return Database.getNetworkByName(this.networkName);
	}
	
	
	//Required
	
	//we assume that we will only add devices through a network
	this.addDevice = function addDevice(device){
		this.networkJSON.device_list.push(device.deviceJSON);
		this.device_list.push(device);
		Database.saveNetwork( this.networkJSON);
		device.joinNetwork(this);
	};
	
	//Required
	this.removeDevice= function(device){
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
	var network_data={};
	network_data.network_name = '';
	network_data.network_type = 'Wi-Fi';
	network_data.partition = '';
	network_data.device_list = [];
	return network_data;
};
module.exports.Network = Network;