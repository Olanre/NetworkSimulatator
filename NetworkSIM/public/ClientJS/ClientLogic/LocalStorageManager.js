/**
 * getfromStorage gets an item from the local storage on the device by id
 * @param id: the key of the element to retrieve from local storage
 */
function getfromStorage(id){
	return sessionStorage.getItem(id);
}

/**
 * putinStorage puts an item into local storage under a key
 * @param id: the key under which to store the item in local storage
 * @param item: the item to store in local storage
 */
function putinStorage(id, item){
	if( id !== null && item !== null){
		sessionStorage.setItem(id, item);
	}
}

/**
 * clears the local storage
 */
function clearStorage(){
    localStorage.clear();
    sessionStorage.clear();
}