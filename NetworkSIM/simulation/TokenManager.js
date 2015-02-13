/*****
The purpose of this class is to manage token data. When
created, it creates its own token database.
@author Emily, Noah
******/


/****
 * Creates a new TokenDatabase object too!
 ***/
var crypto = require('crypto');
var Database = require('../Database/mongooseConnect.js');
/**
function TokenManager(){
	var TokenDatabase=require("./TokenDatabase.js");
};
*/
/**
Method to join a simulation. It will throw an error message string if the token is invalid.
**
function joinSimulation(token,browserIdentifier){
	
	var sim= TokenDatabase.findSimulation(token);
	TokenDatabase.useToken(browserIdentifier,token);
	return sim;

};
*/

/**
 * Authenticates a token, returns a boolean value based on whether or not the device is valid.
 */

exports.authenticateToken = function authenticateToken(token, callback){
	var user = Database.getUserByToken(token, function(obj){
		//console.log(obj);
		var res = {};
		if(obj == null){
			res.Response = 'Fail';
		}else{
			
			console.log(token);
			console.log(obj);
			res.Response = 'Success';
			obj.verified = true;
			Database.modifyUser(token, obj, function(){
				console.log();
			});
		}
		callback(res);
	});
	
	
}

function generateToken(){
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
	return hash;
}

module.exports.generateToken = generateToken;
