/**
 * Handles the views for devices, routing the correct functions and making sure things display correctly
 */

 /**
  * Wraps join network so as to refresh the page when finished
  */
function joinNetworkWrapper(device_token, network_id){
	moveDeviceToNetwork(device_token, network_id);
	NetworksListView();
	//set timeout
}

 /**
  * Wraps leave network so as to refresh the page when finished
  */
function leaveNetworkWrapper(device_token, network_id){
	removeDevicefromNetwork(device_token, network_id);
	NetworksListView();
}