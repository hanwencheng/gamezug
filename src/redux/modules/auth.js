const LOAD = 'omzug/auth/LOAD';
const LOAD_SUCCESS = 'omzug/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'omzug/auth/LOAD_FAIL';
const LOGIN = 'omzug/auth/LOGIN';
const LOGIN_SUCCESS = 'omzug/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'omzug/auth/LOGIN_FAIL';
const LOGOUT = 'omzug/auth/LOGOUT';
const LOGOUT_SUCCESS = 'omzug/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'omzug/auth/LOGOUT_FAIL';

const SUBMIT = 'omzug/auth/SUBMIT';
const SUBMIT_SUCCESS = 'omzug/auth/SUBMIT_SUCCESS';
const SUBMIT_FAIL = 'omzug/auth/SUBMIT_FAIL';
const LOG_ERROR = "omzug/auth/LOG_ERROR";
const CLEAR_MESSAGE = "omzug/auth/CLEAR_MESSAGE";
const START_EDIT = "omzug/auth/START_EDIT";
const ADD_IMAGE = "omzug/auth/ADD_IMAGE";
const DELETE_IMAGE = "omzug/auth/DELETE_IMAGE";
const CHANGE_SLIDE = "omzug/auth/CHANGE_SLIDE";
const CLEAR_UPDATE_FLAG = "omzug/auth/CLEAR_UPDATE_FLAG";
const UPDATE = 'omzug/auth/UPDATE';
const UPDATE_SUCCESS = 'omzug/auth/UPDATE_SUCCESS';
const UPDATE_FAIL = 'omzug/auth/UPDATE_FAIL';

const CHECK = 'omzug/auth/CHECK';
const CHECK_SUCCESS = 'omzug/auth/CHECK_SUCCESS';
const CHECK_FAIL = 'omzug/auth/CHECK_FAIL';

const CLEAR_LOGIN_ERROR = 'omzug/auth/CLEAR_LOGIN_ERROR';

import strings from '../../constant/strings';
import {validateImage} from '../../utils/validation';

const initialState = {
  loaded: false,
  loginError: null,
  loggingIn : false,

  cachedImages : [],
  feedback : null,
  editing : false,
  submitting : false,
  cached : null,
  updated : false,
  currentSlide: 0,
  data : {
    images : [],
    contactEmail : "",
    contactPhone : "",
    contactWechat : "",
    location : "",
    description : "",
    website : ""
  },
};

function generalizeParameter(data, images){
  var submitData;
  //in case data base error
  //data.brand = data.brand.toLowerCase();
  if(!data.hasOwnProperty("contactEmail")|| (data.contactEmail && data.contactEmail.trim()=="")) {
    data.contactEmail=""
  }
  if(!data.hasOwnProperty("contactPhone")|| (data.contactPhone && data.contactPhone.trim()=="")) {
    data.contactPhone=""
  }
  if(!data.hasOwnProperty("contactWechat")|| (data.contactWechat && data.contactWechat.trim()=="")) {
    data.contactWechat=""
  }
  if(!data.hasOwnProperty("location")|| (data.location && data.location.trim()=="")) {
    data.location=""
  }
  if(!data.hasOwnProperty("website")|| (data.website && data.website.trim()=="")) {
    data.website=""
  }
  if(!data.hasOwnProperty("images") || data.images == undefined)
    data.images = [];

  //if(images.length > 0){
  submitData = {
    data : data,
    files : images,
  }
  //console.log('submit data in web is: ', submitData)
  return submitData;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: {error : strings.loginFailError}
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case CLEAR_LOGIN_ERROR:
      return {
        ...state,
        loginError : null,
        error : null,
      }
    case CHECK:
        return {
          ...state,
          check: "checking"
        };
    case CHECK_SUCCESS:
          return {
            ...state,
            check : "success",
            checkMessage : action.result
          }
    case CHECK_FAIL:
          return {
            ...state,
            check : "fail",
            checkError : action.error
          }
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
        updated : true,
        cached : null,
        feedback : strings.editSuccess,
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
    case LOG_ERROR :
      return {
        ...state,
        feedback : action.error
      }
    case START_EDIT:
      return {
        ...state,
        editing : true
      }
    case CLEAR_MESSAGE:
      return {
        ...state,
        feedback : null
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
        currentSlide : action.page
      }
    case CLEAR_UPDATE_FLAG:{
      return {
        ...state,
        updated : false
      }
    }

    case UPDATE:
      return {
        ...state,
        loading : true,
        feedback : null,
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading : false,
        loaded : true,
        user:  action.result,
        //feedback : null,
      };
    case UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        feedback: action.error,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

//email must be a string
export function check(email){
  return {
    types: [CHECK, CHECK_SUCCESS, CHECK_FAIL],
    promise : (client) => client.get('/check?email=' + email)
  }
}

export function login(email, password) {
  if(!email){
    return {
      type: LOGIN_FAIL,
      error : strings.missEmailError,
    }
  }else if(!password){
    return {
      type: LOGIN_FAIL,
      error : strings.missPasswordError,
    }
  }
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/login', {
      data: {
        email: email,
        password : password
      }
    })
  };
}

//it also use the same action as log, because most thing is the same
export function register(data){
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('./register', {
      data : data
    })
  }
}

export function onSubmit(data, images, userId){

  const imageError = validateImage(images)
  if(imageError){
    return {
      type : LOG_ERROR,
      error : imageError,
    }
  }

  for(var item in data){
    if(data.hasOwnProperty(item)){
      var forbid = ["email" , "username", "password"]
      if(forbid.some(function(word){
          return item == word
        }))
        delete data[item];
    }
  }
  return {
    cached : data,
    types: [SUBMIT, SUBMIT_SUCCESS, SUBMIT_FAIL],
    promise: (client) => client.post('./updateUser/'+ userId, generalizeParameter(data, images))
  }
}

export function onStartEdit(){
  return {
    type : START_EDIT
  }
}

export function onClearMessage(){
  return {
    type : CLEAR_MESSAGE
  }
}

export function onChangeSlide(page){
  return {
    type: CHANGE_SLIDE,
    page: page,
  }
}

export function onAddImage(images){
  //console.log('in onAddImage images are', image)
  return {
    type : ADD_IMAGE,
    images : images,
  }
}

export function onClearUpdate(){
  return{
    type : CLEAR_UPDATE_FLAG
  }
}

export function onDeleteImage(id){
  return {
    type : DELETE_IMAGE,
    id : id,
  }
}


export function onUserUpdate(id) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.get('/getUpdate/' + id)
  };
}


export function clearLoginError(){
  return {
    type : CLEAR_LOGIN_ERROR,
  }
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}
