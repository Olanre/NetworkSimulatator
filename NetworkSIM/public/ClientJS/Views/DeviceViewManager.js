/**
 * Handles the views for devices, routing the correct functions and making sure things display correctly
 */
function joinNetworkWrapper(device_token, network_id){
	moveDeviceToNetwork(device_token, network_id);
	NetworksListView();
}

function leaveNetworkWrapper(device_token, network_id){
	console.log("here");
	removeDevicefromNetwork(device_token, network_id);
	NetworksListView();
}