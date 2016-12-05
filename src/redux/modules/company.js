/**
 * Created by hanwencheng on 1/9/16.
 */
var update = require('react-addons-update');
import {validateImage} from '../../utils/validation';
import strings from '../../constant/strings';
var config = require('../../config');

const LOAD = 'omzug/entity/LOAD';
const LOAD_SUCCESS = 'omzug/entity/LOAD_SUCCESS';
const LOAD_FAIL = 'omzug/entity/LOAD_FAIL';
const SUBMIT = 'omzug/entity/SUBMIT';
const SUBMIT_SUCCESS = 'omzug/entity/SUBMIT_SUCCESS';
const SUBMIT_FAIL = 'omzug/entity/SUBMIT_FAIL';
const CLEAR = 'omzug/entity/CLEAR'
const OPEN_CONTACT = "omzug/entity/OPEN_CONTACT";
const CLOSE_CONTACT = "omzug/entity/CLOSE_CONTACT";
const START_EDIT = "omzug/entity/START_EDIT";
const END_EDIT = "omzug/entity/END_EDIT";
const CACHE_DATA = "omzug/entity/CACHE_DATA";
const ADD_IMAGE = "omzug/entity/ADD_IMAGE";
const DELETE_IMAGE = "omzug/entity/DELETE_IMAGE";
const CHANGE_SLIDE = "omzug/entity/CHANGE_SLIDE";
const SUBMIT_NEW_SUCCESS = "omzug/entity/SUBMIT_NEW_SUCCESS";
const CLEAR_MESSAGE = "omzug/entity/CLEAR_MESSAGE";
const LOG_ERROR = "omzug/entity/LOG_ERROR";
const INIT_ENTITY = "omzug/entity/INIT_ENTITY";
const TOGGLE = "omzug/entity/TOGGLE";
const CHANGE_TYPE = "omzug/entity/CHANGE_TYPE";
const CHANGE_PRICE_TYPE = "omzug/entity/CHANGE_PRICE_TYPE";
const CALCULATE_GEOMETRY = "omzug/entity/CALCULATE_GEOMETRY";
const CHANGE_SEARCH_VALUE = "omzug/entity/CHANGE_SEARCH_VALUE";
const SUBMIT_NEW_FAIL = "omzug/entity/SUBMIT_NEW_FAIL";
const CLEAR_LOAD_ERROR = "omzug/entity/CLEAR_LOAD_ERROR"

const initState = {
  loaded: false,
  loadError: null,
  editing : false,
  contactOpen : false,
  data : {
    _id : null,
    city: "",//which should be a string
    type : null,
    priceType : null,
    price: null,
    startDate : null,
    title : null,//TODO need set to null in production
    owner : null,
    username : null,

    lat : null,
    lng : null,
    wechat: null,
    location: null,
    size : null,
    caution: null,
    endDate : null,
    description: null,
    email : null,
    phone : null,
    note : null,
    images:[],

    name : null,
    brand : "",
    batch_number : null,
    total_number : null,
    address : null,
    production_date : null,
    expiration_date : null,
  },
  searchValue : "",
  hasLimit : false,
  cachedImages:[],
  currentSlide: 0,
  feedback: null,
  createData: null,
};

export default function reducer(state = initState, action){
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        loadError : null,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        loadedId : action.result._id,
        data: update(state.data, {$merge : action.result}),
        error: null,
        loadError : null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadError: action.error,
        error: action.error
      };
    case SUBMIT:
      var cachedData = Object.assign({}, state.data);
      return {
        ...state,
        submitting : true,
        cached : cachedData,
        data : action.cached,
        editing : false,
        currentSlide : 0,
        feedback : strings.submitting,
      }
    case SUBMIT_SUCCESS:
      //state.cachedImages.forEach(function(image){
      //  if(!image.pushed) {
      //    update(image, {$merge: {pushed : true}})
      //    cachedData.images.push(window.URL.createObjectURL(image))
      //  }
      //})
      return {
        ...state,
        submitting : false,
        //data : cachedData,
        cached : null,
        feedback : strings.editSuccess,
      }
    case SUBMIT_NEW_SUCCESS:
      //only add a new createData property here
      return {
        ...state,
        submitting :false,
        //data : action.result.data,
        cached : null,
        feedback : strings.submitSuccess,
        //this id should be a string
        createData : action.result.data,
        loaded: true,
        loading: false,
        loadedId: action.result.data._id,
        error : null,
      }
    case SUBMIT_FAIL:
      var originData = Object.assign({}, state.cached);
      return {
        ...state,
        submitting : false,
        data : originData,
        cached :null,
        feedback : action.error,
        cachedImages : [],
      }
    case SUBMIT_NEW_FAIL:
      return {
        ...state,
        submitting : false,
        cached :null,
        feedback : action.error,
      }
    case LOG_ERROR :
      return {
        ...state,
        feedback : action.error
      }
    case CLEAR:
      return initState;
    case INIT_ENTITY :
      return {
        ...state,
        data : update(state.data, {
          brand : {$set : action.brand},
          owner : {$set : action.owner},
          username : {$set : action.username},
          production_date : {$set : new Date()},
          //price : {$set :  0}
        }),
        createData : null,
      }
    case CLEAR_MESSAGE:
      return {
        ...state,
        feedback : null
      }
    case CLOSE_CONTACT:
      return {
        ...state,
        contactOpen : false
      }
    case OPEN_CONTACT:
      return {
        ...state,
        contactOpen : true
      }
    case START_EDIT:
      return {
        ...state,
        editing : true
      }
    case END_EDIT:
      return {
        ...state,
        editing :false
      }
    case TOGGLE:
      return {
        ...state,
        hasLimit : action.value,
      }
    case ADD_IMAGE:
      // once only one image as input
      //console.log('the initial cached images are', state.cachedImages)
      const images = update(state.cachedImages, {$push: action.images})
      //console.log('after update the cachedImages are', images)
      return {
        ...state,
        cachedImages: images,
      }
    case DELETE_IMAGE:
      // notice action.id is start from 0
      const lengthRemote = state.data.images.length;
      const lengthCached = state.cachedImages.length;
      if(action.id < lengthRemote){
        return update(state, {data: {images: {$splice: [[action.id, 1]]}}});
      }else if(action.id < lengthCached + lengthRemote){
        return update(state, {cachedImages : {$splice : [[action.id - lengthRemote , 1]]}})
      }else{
        return
      }
    case CHANGE_SLIDE:
      return {
        ...state,
        currentSlide : action.page,
      }
    case CHANGE_TYPE:
      return {
        ...state,
        data : update(state.data, {type : {$set : action.value}})
      }
    case CHANGE_PRICE_TYPE:
      return {
        ...state,
        data : update(state.data, {priceType : {$set : action.value}})
      }
    case CALCULATE_GEOMETRY:
      return {
        ...state,
      }
    case CHANGE_SEARCH_VALUE:
      return {
        ...state,
        searchValue : action.value
      }
    case CLEAR_LOAD_ERROR:
      return {
        ...state,
        loadError : null,
      }
    default :
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.entity && globalState.entity.loaded;
}

export function onClear(){
  return {
    type: CLEAR
  }
}

export function onContactOpen(){
  return {
    type: OPEN_CONTACT
  }
}

export function onContactClose(){
  return {
    type : CLOSE_CONTACT
  }
}

export function onStartEdit(){
  return {
    type : START_EDIT
  }
}

export  function onEndEdit(){
  return {
    type : END_EDIT
  }
}


//Deprecated
export function onCalculateGeometry(location, city){
  return {
    type : CALCULATE_GEOMETRY,
  }
}

export function onAddImage(images){
  //console.log('in onAddImage images are', image)
  return {
    type : ADD_IMAGE,
    images : images,
  }
}

export function onDeleteImage(id){
  return {
    type : DELETE_IMAGE,
    id : id,
  }
}

export function onLoadInit(){
  return {
    type : LOAD_INIT,
  }
}

function generalizeParameter(data, images){
  var submitData;
  //data.brand = data.brand.toLowerCase();
  if(data.email==""|| (data.email && data.email.trim()=="")) {
    data.email=null
  }
  if(data.phone==""|| (data.phone && data.phone.trim()=="")) {
    data.phone=null
  }
  //if(images.length > 0){
  submitData = {
    data : data,
    files : images,
  }
  //console.log('submit data in web is: ', submitData)
  return submitData;
}
/**
 * validate the images
 * @param images
 * @return error
 */
function checkImage(images){
  return validateImage(images)
}

export function onSubmit(data, images, entityId, ownerId){
  const imageError = checkImage(images)
  if(imageError){
    return {
      type : LOG_ERROR,
      error : imageError,
    }
  }
  return {
    cached : data,
    types: [SUBMIT, SUBMIT_SUCCESS, SUBMIT_FAIL],
    promise: (client) => client.post('./submit/'+ entityId, generalizeParameter(data, images))
  }
}


export function onSubmitNew(data, images){
  const imageError = checkImage(images)
  if(imageError){
    return {
      type : LOG_ERROR,
      error : imageError,
    }
  }
  return {
    cached : data,
    types: [SUBMIT, SUBMIT_NEW_SUCCESS, SUBMIT_NEW_FAIL],
    promise: (client) => client.post('./submit', generalizeParameter(data, images))
  }
}

export function onLogError(error){
  return {
    type :LOG_ERROR,
    error : error
  }
}

export function onClearMessage(){
  return {
    type : CLEAR_MESSAGE
  }
}

export function onInitEntity(locationId, brandList, ownerId, username){
  var brand = ""
  if(locationId !== null && brandList.length){
    brand = brandList[locationId].label
  }
  return {
    type : INIT_ENTITY,
    //brand : brand,
    owner : ownerId,
    username : username,
  }
}

export function onToggleLimit(value){
  return {
    type : TOGGLE,
    value : value
  }
}

export function onChangeSlide(page){
  return {
    type: CHANGE_SLIDE,
    page: page,
  }
}

export function onChangePriceType(value){
  return {
    type : CHANGE_PRICE_TYPE,
    value : value,
  }
}

export function onChangeType(value){
  return {
    type : CHANGE_TYPE,
    value : value,
  }
}

export function onChangeSearchValue(value){
  return {
    type : CHANGE_SEARCH_VALUE,
    value : value,
  }
}

export function onClearLoadError(){
  return {
    type : CLEAR_LOAD_ERROR,
  }
}

export function onLoad(number){
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      const url = '/house/' + number
      return client.get(url)
    } // params not used, just shown as demonstration
  };
}