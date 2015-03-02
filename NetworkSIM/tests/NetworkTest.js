var Device=require("../simulation/Device.js");
var Network=require("../simulation/Network.js");
var Util=require("../simulation/Utilities.js");

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

	var connected=device.networkObject==network;
	var inJSON=device.deviceJSON.current_network==network.network_name;

	var result=inList&&inJSONlist&&connected&&inJSON;
	var text=result ? 'passed': 'failed';
	console.log("addDevice/joinNetwork "+text);

}

module.exports.testNetworkCreation();
module.exports.testNetworkLoading();
module.exports.testNetworkJoining();