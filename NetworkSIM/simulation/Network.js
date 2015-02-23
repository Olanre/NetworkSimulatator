exports.Network(){
	var network_data = {};
	//Required
	network_data.networkName = networkName; // String
	//Required
	network_data.networkKind = networkKind; // Constant: WiFi, GSM
}
//Required
exports.addDevice = function(device){
  deviceList.push(device);
};

//Required
exports.removeDevice = function(device){
	var deviceIndex=deviceList.indexOf(device);
	deviceList.splice(deviceIndex,1);
};
//Required
exports.connectNetwork = function(network){
};
//Required
exports.disconnectNetwork = function(network){
};