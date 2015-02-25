function breadthFirstSearch(circleObject, searchedForObject){
	var queue=[];
	var discovered=[];
	queue.push(circleObject);
	discovered.push(connectedCircle);
	while (queue.length>0){
		//pops from queue
		currentNetworkCircle=queue.shift();
		for (var i = 0; i<currentNetworkCircle.connections;i++){
			alert(currentNetworkCircle.connections);
			connectedCircle=currentNetworkCircle.connections[i];
			if (!contains(connectedCircle, discovered)){
				if(connectedCircle === searchedForObject){
					return true;
				}
				else{
					queue.push(connectedCircle);
					discovered.push(connectedCircle);
				}
			}
		}
	}
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