/**
 * Created by hanwencheng on 2/4/16.
 */
var formidable = require('formidable');
const async = require('async')
import DB from '../../lib/db-interface.js';
var mongoModel = require('../../lib/model.js')
var createId = mongoModel.createId
var fs = require('fs');
var aws = require('../../lib/aws');
var tmpPath = require('../../lib/config').tmpPath;
var awsPrefix = require('../../lib/config').awsPrefix;
import {geocode} from '../../lib/googleMap';
import {logger} from '../../lib/logger';

function processImageAddress(path){
  var paths = path.split("/")
  var relativePath = paths[paths.length - 1]
  return relativePath
}

export default function submit(req, params) {
  logger.debug('in api update user.js we get request is', params)

  //1. compare address array and the database
  //先增加后减少的情况,做判断
  // if less, then check filenames, if exist here, then keep same, if not exist, delete it

  // 先减少后增加的情况,只能重新上传

  //对FILES NAME 做判断


  var submitHouse = req.body;
  var form = new formidable.IncomingForm();
  form.uploadDir = tmpPath;
  form.keepExtensions = true;

  form.on('fileBegin', function(field, file) {
    logger.debug('file name is', file.name)
  })

  var filesArray = []
  form.on('file', function(name, file) {
    var nameArray = file.path.split('/');
    var replaceName = nameArray[nameArray.length - 1];
    // upload_xxx.jpg -->omzug_xxx.jpg
    replaceName = 'omzug-' + replaceName.slice(7)

    file.name = replaceName
    filesArray.push(file);
  })

  return new Promise((resolve, reject) => {

    var house;
    var deleteFiles = [];

    var steps = [
      parseRequest,
      //calculateLocation,
      compareImages,
      deleteImages,
      uploadImage,
      deleteLocalTemp,
      updateDatabase,
    ]

    function parseRequest(callback) {
      form.parse(req, function (err, fields, files) {
        if (err) {
          callback(err)
        } else {
          logger.debug("received files are ", filesArray.length + " element array")

          house = Object.assign({}, fields)
          logger.debug('copied company object is', house)

          // normalize images, only these two situation
          if(house.images == '' || house.image == 'undefined'){
            house.images = []
          }else {
            house.images = house.images.split(',')
          }
          callback(null, house, filesArray)
        }
      })
    }

    function compareImages(house, files, callback) {
      //if new entity, skip this
      if(params.length == 0)
        return callback(null, house, files)

      var houseId = createId(house._id)
      DB.get('user', {_id: houseId}, function (result) {
        result.data.images.forEach(function (imageAddress) {
          // if it is in our database
          if (house.images.indexOf(imageAddress) < 0) {
            deleteFiles.push(imageAddress);
          }
        })
        callback(null, house, files)
      }, function (err) {
        callback(err)
      })
    }

    function deleteImages(house, files, callback){
      var finished = 0;
      if(deleteFiles.length <= 0)
        return callback(null, house, files)


      deleteFiles.forEach(function(imageAddress){
        aws.delete('user', house.username , processImageAddress(imageAddress), function(err, result){
          logger.trace('finished is ', finished, 'err is', err, 'result is ', result)
          if(err){
            callback(err)
          }else{
            finished ++;
            if(finished == deleteFiles.length){
              callback(null, house, files)
            }
          }
        })
      })
    };

    function compressImages(){

    }

    function uploadImage(house, files, callback) {
      if(files.length == 0){
        return callback(null, house, files)
      }
      var finished = 0

      files.some(function(file){
        logger.debug('start upload with file ', file.name)
        aws.upload('user', file, house.username, function (err, data) {
          if (err) {
            callback(err)
            return true
          }else{
            logger.trace("here we get data is", data)
            // TODO should process it into address
            const path = awsPrefix + house.username + '/' + file.name;
            logger.trace('the adding images path is ', path)
            house.images = house.images.concat(path)
            finished ++
            if(finished == files.length) {
              callback(null, house, files)
            }
          }
        })
      })
    }

    function deleteLocalTemp(house, files, callback){
      if(files.length == 0){
        return callback(null, house)
      }
      var deleted = 0;
      files.some(function(file){
        fs.unlink(file.path, function(err){
          if(err){
            callback(err)
            return true
          }
          logger.debug('successful delete file', file.name)
          deleted++
          if(deleted == files.length){
            callback(null, house)
          }
        })
      })
    }


    function updateDatabase(house, callback) {
      // this case is update existed house
      console.log("request id is", house._id)
      DB.update('user', {_id : house._id}, house, function(result){
        logger.debug('update user in our database: ', result.data._doc)
        req.session.user = result.data._doc;
        callback(null, result.data._doc)
        //update session
      }, function(err){
        callback(err)
      })
    }

    async.waterfall(steps, function(err, result){
      if(err){
        logger.error("we got error in submit is " , err)
        if(err.msg) {
          reject(err.msg)
        }else if(typeof err == "string"){
          reject(err)
        }else{
          reject('submit internal error')
        }
      }else {
        resolve({
          status : true,
          data : result
        })
      }
    })
  })

}