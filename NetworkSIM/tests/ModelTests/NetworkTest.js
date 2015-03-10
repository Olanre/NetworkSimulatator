var Device=require("../Model/Device.js");
var Network=require("../Model/Network.js");
var Util=require("../Utilities/utilities.js");

var JSONNetworkTemplate={
	network_name:undefined,
	network_type:undefined,
	partition_name:'',
	device_list:undefined
};

var networkJSON={
		network_name:"networkA",
		network_type:"Wi-FI",
		partition_name:' ',
		device_list:undefined
}

module.exports.testNetworkCreation=function(){
	var createdNetwork=Network.createNewNetwork();
	var result=Util.compareObjects(createdNetwork.networkJSON,JSONNetworkTemplate);
	if(!result) console.log(createdNetwork.networkJSON);
	var text=result ? 'passed': 'failed';
	console.log("createNewNetwork " +text);

	return result;
}

module.exports.testNetworkLoading=function(){
	var loadedNetwork=Network.loadNetworkFromJSON(networkJSON);
	var result=Util.compareObjects(loadedNetwork.networkJSON,networkJSON);
	if(!result) console.log(loadedNetwork.networkJSON);
	var text=result ? 'passed':'failed';
	console.log("loadNetworkFromJSON "+text);
	return result;
}

module.exports.testNetworkJoining=function(){

	var network=Network.createNewNetwork("testNetwork");
	var device=Device.createNewDevice("testDevice");
	network.addDevice(device);
	
	var inList=false;
	var devList=network.device_list;

	for(var i=0;i<devList.length;i++){
		if(devList[i]==device){
			inList=true;
			break;
		}
	}

	var jsondevlist=network.networkJSON.device_list;
	var inJSONlist=false;
	for(var i=0;i<jsondevlist.length;i++){
		if(jsondevlist[i]==device.deviceJSON){
			inJSONlist=true;
			break;
		}
	}

	

	var result=inList&&inJSONlist;
	if(!result) console.log(network.networkJSON);
	var text=result ? 'passed': 'failed';
	console.log("addDevice "+text);

	result=testIfDeviceJoined(device,network);
	if(!result) console.log(device.deviceJSON);
	text=result ? 'passed':'failed';
	console.log("joinNetwork "+text);

	return result&&inList&&inJSONlist;
}

function testIfDeviceJoined(device,network){
	var connected = device.networkObject==network;
	var inJSON = device.deviceJSON.current_network==network.network_name;
	//var partition = device.deviceJSON.current_partition==network.networkJSON.partition_name;
	//var partition2 = network.partitionObject.partition_name==network.networkJSON.partition_name;


	var result=connected&&inJSON;
	return result;
	
}

module.exports.testNetworkLeaving=function(){
	var network=Network.createNewNetwork("testNetwork");
	var device;

	var leaveNetwork=true;
	var inNetwork=false;
	for(var i=0;i<5;i++){
		device=Device.createNewDevice(i.toString);
		network.addDevice(device);
		network.removeDevice(device);
		leaveNetwork=leaveNetwork&&!testIfDeviceJoined(device,network);
		inNetwork=inNetwork||!(Util.findByUniqueID(device._id,network.device_list));
	}

	var jsondevlist=network.networkJSON.device_list;
	var inJSONlist=false;
	for(var j=0;i<jsondevlist.length;j++){
		if(jsondevlist[j]==device.deviceJSON){
			inJSONlist=true;
			break;
		}
	}

	inNetwork=inNetwork||inJSONlist;

	var text= inNetwork ? 'failed' : 'passed';
	console.log('removeDevice '+text);

	text=leaveNetwork ? 'passed' : 'failed';
	console.log('leaveNetwork '+ text);

	return inNetwork&&leaveNetwork;

}

module.exports.testNetworkConnection=function(){

	var net1 = Network.createNewNetwork("test1");
	var net2 = Network.createNewNetwork('test2');
	net1.connectNetwork(net2);

	var samePartitionObject= net1.partitionObject==net2.partitionObject;
	var sameJSON = net1.networkJSON.partition_name==net2.networkJSON.partition_name;

	var partition=net1.partitionObject;

	var foundnet1=false;
	var foundnet2=false;

	for(netkey in partition.network_list){
		if(partition.network_list[netkey]==net1) foundnet1=true;
		if(partition.network_list[netkey]==net2) foundnet2=true;
	}

	var text= foundnet1&&foundnet2&&samePartitionObject&&sameJSON ? 'passed' : 'failed';
	console.log("connectNetwork "+text);
	return foundnet1&&foundnet2&&samePartitionObject&&sameJSON;
}

module.exports.testNetworkDisconnection=function(){

	var net1 = Network.createNewNetwork("test1");
	var net2 = Network.createNewNetwork("test2");
	var net3 = Network.createNewNetwork("test3");

	net1.connectNetwork(net2);
	net2.connectNetwork(net3);

	net3.disconnectNetwork(net1);

	var partition1=net3.partitionObject;
	var partition2=net1.partitionObject;

	var network3connected=false;

	for(network in partition1.network_list){
		if(partition1.network_list[network]==net1) network3connected=true;
	}

	for(network in partition2.network_list){
		if(partition2.network_list[network]==net3||partition2.network_list[network]==net2) network3connected=true;
	}
	
	var text= network3connected ? 'failed' : 'passed';
	console.log("disconnectNetwork "+text);

	return !network3connected;
}

module.exports.testNetwork=function(){
	var functions=[];
	functions.push(module.exports.testNetworkCreation);
	functions.push(module.exports.testNetworkLoading);
	functions.push(module.exports.testNetworkJoining);
	functions.push(module.exports.testNetworkLeaving);
	functions.push(module.exports.testNetworkConnection);
	functions.push(module.exports.testNetworkDisconnection);
	var continueTesting=true;

	for(var i=0;i<functions.length;i++){
		continueTesting=continueTesting&&functions[i]();
		if(!continueTesting)break;
	}
	return continueTesting;
}

module.exports.testNetwork();