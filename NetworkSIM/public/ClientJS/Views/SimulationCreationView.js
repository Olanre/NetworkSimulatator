
//holds the number of networks
var netnumbers = 0;
//holds the number of devices
var devicenumbers = 0;
//holds the number of available left to fill
var avail_networks = 0;
//holds the number of devices availablle to fill
var avail_devices = 0;
 

/**
 * expandField expands the section to allow you to add networks and devices
 * @param selector: the field in which to expand (ie devices, networks, etc)
 */
function expandField(selector){
	var number; 
	if (selector.name == 'netnumbers'){
		number = selector.value;
		if(isInt(number)){
			netnumbers = number;
		}
	}
	if( selector.name == 'devicenumbers'){
		number = selector.value;
		if(isInt(number)){
			devicenumbers = number;
		}
	}
	if( netnumbers > 0 && devicenumbers > 0){
		generateConfigTable();
	}
	
}

function checkField(elem){
	if(elem.value == null){
		alert('Please enter a value!');
	}
}

/**
 * generateConfigTable creates the table for which to configurate
 * a new simulation.
 */
function generateConfigTable(){
	
	avail_networks = netnumbers;
	avail_devices = devicenumbers;
	document.getElementById('avail-devices').innerHTML = avail_devices;
	document.getElementById('avail-networks').innerHTML = avail_networks;
	if( avail_devices >0 && avail_networks > 0 ){
		var add_buttons = document.getElementsByClassName('partition-adder');
		enableButtons(add_buttons);
	}
	
	
}

/**
 * updateavailableField updates the available number of devices
 * and networks.
 */
function updateavailableField(){
	document.getElementById('avail-devices').innerHTML = avail_devices;
	document.getElementById('avail-networks').innerHTML = avail_networks;
}
/**
 * addtoConfigTable inserts a new element in to the page allowing you to create a new partition, network, and device
 */
function addtoConfigTable(insert_point, name, element){
	if( insert_point == null || element == null) return false;
	var html = '';
	element.disabled = false;
	var div = null;
	switch(name){
		case 'Network':
			if( avail_networks > 0){
				div = createTrElement();
				avail_networks -= 1;
				avail_devices -= 1;
				html = generateNetworkTable();
				
			}else{
				element.disabled = true;
			}
			break;
		case 'Device':
			
			if( avail_devices >0 ){
				div = createTrElement();
				html = generateDeviceClass();
				avail_devices -= 1;
			}else{
				element.disabled = true;
			}
			
			break;
		case 'Partition':
			if( avail_devices >0 && avail_networks > 0 ){
				div = createTableElement();
				html = generatePartitionTable();
				avail_networks -= 1;
				avail_devices -= 1;
			}else{
				element.disabled = true;
			}
			
			break;
		default:
				
	}
	if( div !== null){
		div.innerHTML = html;
		parent_of_insert = insert_point.parentNode;
		parent_of_insert.insertBefore(div, insert_point);
	}
	updateavailableField();	
}

/**
 * registerNewEmail creates a location on the page to enter a new 
 * email to be registered with the server
 * @param e: not sure what e is
 * @param insert_point: The point in the DOM tree at which to enter the element
 */
function registerNewEmail(e, insert_point){

	var email = document.getElementById('new_email').value;
	var newemail = "<td> <input type = 'checkbox' name = 'email[]' value = '" + email + "'> " + email + " </td> ";
		
	var dummyelement = createTrElement();
	dummyelement.innerHTML = newemail;
	parent_of_insert = insert_point.parentNode;
	parent_of_insert.insertBefore(dummyelement, insert_point);
	var email = document.getElementById('new_email').value = '';

	
}

/**
 * deletefromConfigTable delete a field from the table. 
 * @param delete_point
 * @param name: what kind of field we are deleting from the table
 * @param map
 * @returns {Boolean}
 */
function deletefromConfigTable(delete_point, name, map){
	if( delete_point == null || map == null) return false;
	var html;
	element = document.getElementById(map);
	switch(name){
		case 'Network':
			avail_networks += 1;
			removeDevices( delete_point);
			if( avail_networks > 0){
				var add_buttons = element.getElementsByClassName('net-adder');
				enableButtons(add_buttons);
			}
			break;
		case 'Device':
			avail_devices += 1;
			if( avail_devices >0 ){
				var add_buttons = element.getElementsByClassName('device-adder');
				enableButtons(add_buttons);
			}
			break;
		case 'Partition':
			removeNetworks( delete_point);
			if( avail_devices >0 && avail_networks > 0 ){
				var add_buttons = element.getElementsByClassName('partition-adder');
				enableButtons(add_buttons);
			}
			break;
		default:
					
	}
	parent_of_delete = delete_point.parentNode;
	parent_of_delete.removeChild(delete_point);
	updateavailableField();
}

/** Function to remove devices from the configuration table
 * @param element: the element to be removed.
 */
function removeDevices( element){
	var allDevices = element.getElementsByClassName('device');
	for(var i = 0; i < allDevices.length; i++){
		avail_devices += 1;
	}
}

/** Function to remove a network from the configuration table
 * @param element: the node cluster to be removed
 */
function removeNetworks( element){
	var allNetworks = element.getElementsByClassName('network');
	for(var i = 0; i < allNetworks.length; i++){
		deletefromConfigTable(allNetworks[i].parentNode.parentNode, 'Network', 'config-map')
	}
}

/** function to enable a list of buttons
 * @param buttons_array, the list of button elements to be enabled
 */
function enableButtons( buttons_array){
	for(var i = 0; i < buttons_array.length; i++){
		buttons_array[i].disabled = false;
	}
	
}
/**
 * create an html tr element floating in the html.
 */
function createTrElement(){
	var mydiv = document.createElement('tr');
	return mydiv;
}

function createTableElement(){
	var mydiv = document.createElement('div');
	mydiv.className='center-table';
	return mydiv;
}

/**
 * create a div element floating in the html.
 */
function createDivElement(){
	var mydiv = document.createElement('div');
	return mydiv;
	
}

/**
 * generatePartitionTable returns an html table to contain the partitions from the templates
 */
function generatePartitionTable(){
	var table = document.getElementById('template2');
	return table.innerHTML;
	
}

/**
 * generateNetworkTable returns an html table to contain from the templates
 * the list of networks
 */
function generateNetworkTable(){
	var network_section = document.getElementById('template3');
	return network_section.innerHTML;
	
}
 
/** Function to get the device section form the templates
 *	@return, the inner html of the template
 */
function generateDeviceClass(){
	var device_section = document.getElementById('template4');
	return device_section.innerHTML;
	
}