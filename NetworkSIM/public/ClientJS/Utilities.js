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

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 */
function merge_objects(obj1,obj2){
    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    return obj1;
}

/**
 * removeItem removes an item from an array
 */
function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
            }
    }
    return array;
}

/**
 * returns the size of an object
 */
function size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * Helper function to remove an element from its parent
 * @param element, the element to be removed
 * @param element
 */
function removeElement(element){
	element.parentNode.removeChild(element);
}

/**
 * insertAfter inserts as a child of the parent "reference node" in a tree.
 * @param newNode: the new node to be inserted
 * @param referenceNode: the parent node 
 */
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//hopefully this will be fine, there is a very low chance of two of the same strings.
//should also check through all created devices as well.
function generateUniqueID() {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < 16; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}