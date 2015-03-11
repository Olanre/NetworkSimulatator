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

function deepCopy(item){
	var copy;
	if(Array.isArray(item)){
	 copy=[];
	}
	else {
		if (item instanceof Object) copy={};
		else return item;
	}

	for (attribute in item){
		copy[attribute]=deepCopy(item[attribute]);
	}

	return copy;
}

function compareObjects(obj1,obj2){

	for(key in obj1){

		if(obj2.hasOwnProperty(key)){

			if(obj1[key]!=obj2[key]){
				if(Array.isArray(obj1[key])){

					compareObjects(obj1[key],obj2[key]);
				}
				else{
					if(obj1[key] instanceof Object){
						compareObjects(obj1[key],obj2[key]);
					}
					else return false;	
				}

			}
		}

		else{
			return false;
		}
		
	}
	return true;

}

/**
 * Removes a javascript or CSS file from this html file. Need this to remove network topolgy stuff
 * @param filename just the filename you want to remove
 * @param filetype js or css
 */
function removeFile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
    	if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
    		console.log("removing: "+allsuspects[i]);
    		allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    	}
    }
}
