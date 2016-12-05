/**
 * Created by hanwencheng on 2/3/16.
 */
import DB from '../../lib/db-interface.js';
var createId  = require('../../lib/model.js').createId;
import {logger} from '../../lib/logger';

export default function getUpdate(req, params) {
  logger.debug('in api getUpdate.js params are', params)

  var houseId
  if (params[0] == 'undefined') {
    houseId = null
  } else {
    houseId = createId(params[0])
  }
  return new Promise((resolve, reject) => {
    DB.get('user', {_id: houseId}, function (result) {
      logger.debug('we get house with result ', houseId)

      //filter important infomation

      //for(var item in data){
      //  if(data.hasOwnProperty(item)){
      //    var forbid = ["email" , "username", "password"]
      //    if(forbid.some(function(word){
      //        return item == word
      //      }))
      //      delete data[item];
      //  }
      //}
      return resolve(result.data)
    }, function (err) {
      logger.error('we got error is, ', err)
      return reject(err.msg)
    })
  });
}