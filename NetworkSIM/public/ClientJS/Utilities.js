/**
 * Breadth first search this works
 * @param circleObject
 * @param searchedForObject
 * @returns {Boolean}
 */
function breadthFirstSearch(circleObject, searchedForObject){
	var queue=[];
	var discovered=[];
	queue.push(circleObject);
	discovered.push(circleObject);
	while (queue.length>0){
		//pops from queue
		var currentNetworkCircle=queue.shift();
		for (index in currentNetworkCircle.connections){
			if (!contains(currentNetworkCircle.connections[index], discovered)){
				if(currentNetworkCircle.connections[index] === searchedForObject){
					return discovered;
				}
				else{
					queue.push(currentNetworkCircle.connections[index]);
					discovered.push(currentNetworkCircle.connections[index]);
				}
			}
		}
	}
	return discovered;
}

function contains(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}
function buildPartition(listOfNetworks){
	var partition={};
	var index=0;
	for(network in listOfNetworks){ 
		var networkobj={};
		var children=listOfNetworks[network].children;
		for(device in children){
			console.log(children[device]);
			networkobj[children[device]]=index;
			index++;
		}
		partition[listOfNetworks[network].name]=networkobj;
		index=0;
	}
	return partition;
}
function generateUniqueId(){
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
	return hash;
}
//delete me after test
module.exports.generateUniqueId=generateUniqueId;
module.exports.buildPartition=buildPartition;