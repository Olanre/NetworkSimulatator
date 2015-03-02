var Device=require("../simulation/Device.js");
var Network=require("../simulation/Network.js");
var Util=require("../simulation/utilities.js");

var JSONNetworkTemplate={
	network_name:undefined,
	network_type:undefined,
	partition_name:undefined,
	device_list:undefined
};

var networkJSON={
		network_name:"networkA",
		network_type:"Wi-FI",
		partition_name:undefined,
		device_list:undefined
}

module.exports.testNetworkCreation=function(){
	var createdNetwork=Network.createNewNetwork();
	var result=Util.compareObjects(createdNetwork.networkJSON,JSONNetworkTemplate);
	var text=result? 'passed': 'failed';
	console.log("createNewNetwork " +text);
}

module.exports.testNetworkLoading=function(){
	var loadedNetwork=Network.loadNetworkFromJSON(networkJSON);
	var result=Util.compareObjects(loadedNetwork.networkJSON,networkJSON);
	var text=result?'passed':'failed';
	console.log("loadNetworkFromJSON "+text);
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
	var text=result ? 'passed': 'failed';
	console.log("addDevice "+text);

	result=testIfDeviceJoined(device,network);
	text=result ? 'passed':'failed';
	console.log("joinNetwork "+text);
}

function testIfDeviceJoined(device,network){
	var connected = device.networkObject==network;
	var inJSON = device.deviceJSON.current_network==network.network_name;
	var partition = device.deviceJSON.current_partition==network.networkJSON.partition_name;
	var partition2 = network.partitionObject.partition_name==network.networkJSON.partition_name;

	var result=connected&&inJSON&&partition&&partition2;
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
		inNetwork=inNetwork||!(Util.findDeviceByName(device.device_name,network.device_list));
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

	var text= foundnet1&&foundnet2&&samePartitionObject&&sameJSON? 'passed' : 'failed';
	console.log("connectNetwork "+text);
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
}


module.exports.testNetworkCreation();
module.exports.testNetworkLoading();
module.exports.testNetworkJoining();
module.exports.testNetworkLeaving();
module.exports.testNetworkConnection();
module.exports.testNetworkDisconnection();