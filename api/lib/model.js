/**
 * Created by hanwencheng on 1/11/16.
 */

var mongoose = require('mongoose');
var config = require('./config.js');
var Schema = mongoose.Schema;
var inited = false;

const userCollectionName = config.userCollectionName;

var UserSchema = require('./schemas/UserSchema.js')(Schema, userCollectionName);

//Init database Models
var initMongoDb = function(){
  if(!inited){
    var link
    if(process.env.NODE_ENV === "production") {
      link = "mongodb://" + config.host + "/" + config.databaseName;
      mongoose.connect(link, {
        server: {poolSize: 100},
        user: config.dbUser,
        pass: config.dbPassword
      });
    }else {
      link = "mongodb://" + config.host + '/' + config.databaseName;
      mongoose.connect(link, {server: {poolSize: 10}});
    }
    inited = true
  }
  return mongoose.connection;
};

module.exports.createId = function(string){
  return new mongoose.Types.ObjectId(string);
}
module.exports.initMongoDb = initMongoDb;
//module.exports.House = mongoose.model(houseCollectionName, HouseSchema);
module.exports.User = mongoose.model(userCollectionName, UserSchema)