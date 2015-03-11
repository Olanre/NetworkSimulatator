//This file needs to be run every single time an application
//is run.

//Initializing the models , might store in mongooseConnect
var models = ['userModel.js', 'networkModel.js', 'simulationModel.js', 'partitionModel.js', 'stateModel.js'];
exports.initialize = function() {
    var l = models.length;
    for (var i = 0; i < l; i++) {
    	console.log("requiring " + models[i]);
        require("./" +models[i])();
    }
};