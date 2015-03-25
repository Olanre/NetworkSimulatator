var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://username:password@ds053139.mongolab.com:53139/sc-2');

//attach lister to connected even
mongoose.connection.once('connected', function(){
   console.log("Connected to database")
  });
Schema = db.Schema;

