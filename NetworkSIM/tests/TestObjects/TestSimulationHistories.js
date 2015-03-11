function createHistory(number){
	var history={};
	history.simulation_id='s0';
	history.state=[];
	console.log("creating");
	for (var i = 0; i <number;i++){
		hist=createHistoryState(i);
		history.state.push(hist);
	}
	console.log(history);
	return history;
}

function createHistoryState(i){
	hist={}
	hist.simulation=generateSimulationObject(i,true);
	hist.timestamp='201'+i+'-03-11T12:05:11.229Z';  
	return hist; 
}

function printHistoryState(history){
	console.log('simulation id: '+history.simulation_id);
	console.log('states:');
	for (var i =0; i<history.state.length;i++){
		console.log('timestamp: '+history.state[i].timestamp);
		printCreatedSimulation(history.state[i].simulation);
	}
}