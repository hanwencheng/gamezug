/**
 * Created by hanwencheng on 1/6/16.
 */

const LOAD = 'omzug/entityList/LOAD';
const LOAD_SUCCESS = 'omzug/entityList/LOAD_SUCCESS';
const LOAD_FAIL = 'omzug/entityList/LOAD_FAIL';
const CLEAR = 'omzug/entityList/CLEAR'
const CHANGE_LOCATION = "omzug/entityList/CHANGE_LOCATION"
const DELETE_HOUSE = 'omzug/entityList/DELETE_HOUSE'
const DELETE_HOUSE_SUCCESS = 'omzug/entityList/DELETE_HOUSE_SUCCESS'
const DELETE_HOUSE_FAIL = 'omzug/entityList/DELETE_HOUSE_FAIL'

const APPEND_SUCCESS = "omzug/entityList/APPEND_SUCCESS"
const APPEND_FAIL = "omzug/entityList/APPEND_FAIL"
const DISABLE_APPEND = "omzug/entityList/DISABLE_APPEND"

const CITY_LIST = "omzug/entityList/CITY_LIST"
const CITY_LIST_SUCCESS = "omzug/entityList/CITY_LIST_SUCCESS"
const CITY_LIST_FAIL = "omzug/entityList/CITY_LIST_FAIL"

const INIT = "omzug/entityList/INIT"
const INIT_SUCCESS = "omzug/entityList/INIT_SUCCESS"
const INIT_FAIL = "omzug/entityList/INIT_FAIL"
const SET_COLUMN = "omzug/entityList/SET_COLUMN"
const REFRESH_ALL = "omzug/entityList/REFRESH_ALL"
const REFRESH_ALL_SUCCESS = "omzug/entityList/REFRESH_ALL_SUCCESS"
const REFRESH_ALL_FAIL = "omzug/entityList/REFRESH_ALL_FAIL"
const CLEAR_DELETE_FEEDBACK = "omzug/entityList/CLEAR_DELETE_FEEDBACK"

var update = require('react-addons-update');
import {capitalizeFirstLetter} from '../../utils/help';
import strings from '../../constant/strings';

const initState = {
  list :[],
  locationId : null,
  loaded: false,
  loading :false,
  isEnd : false,
  cityList : [],
  brandList : [],
  column : 1,
  deleteFeedback : null,
};

export default function reducer(state = initState, action = {}) {
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
        list: action.result.data,
        error: null,
        isEnd : action.result.isEnd,
      };
    case DELETE_HOUSE:
      return {
        ...state,
        deleting : true,
      }
    case DELETE_HOUSE_SUCCESS:
      return {
        ...state,
        deleting : false,
        deleteFeedback : strings.deleteSuccess,
        // index start from 0
        list : update(state.list, {$splice : [[action.index, 1]]})
      }
    case DELETE_HOUSE_FAIL:
      return {
        ...state,
        deleting : false,
        deleteFeedback : strings.deleteError + action.error,
      }
    case APPEND_SUCCESS:
          return {
            ...state,
            loading : false,
            list : update(state.list, {$push: action.result.data}),
            error : null,
            isEnd : action.result.isEnd,
          }
    case APPEND_FAIL:
          return {
            ...state,
            loading : false,
            error: action.error
          }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        list: [],
        error: action.error
      };
    case CITY_LIST:
          return {
            ...state,
            loadingBrand : true,
          }
    case CITY_LIST_SUCCESS:
          return {
            ...state,
            loadingBrand : false,
            brandList : processBrandList(action.result.data)
          }
    case CITY_LIST_FAIL :
          return {
            ...state,
            loadingBrand : false,
            error : action.error
          }
    case REFRESH_ALL:
          return {
            ...state,
            loading: true,
            loadingBrand : true
          }
    case REFRESH_ALL_SUCCESS:
          return {
            ...state,
            loading: false,
            list: action.result.houseList,
            error: null,
            isEnd : action.result.isEnd,
            loadingBrand : false,
            brandList : processBrandList(action.result.brandList),
            locationId : null,
          }
    case REFRESH_ALL_FAIL :
      return {
        ...state,
        loadingBrand : false,
        loading: false,
        list: [],
        error: action.error,
      }
    case INIT :
          return {
            ...state,
            loading : true,
            loadingBrand : true,
          }
    case INIT_SUCCESS:
      console.log("init with action", action.result.houses)
          return {
            ...state,
            loading: false,
            loaded: true,
            list: action.result.houses,
            error: null,
            isEnd : action.result.isEnd,
            loadingBrand : false,
            brandList : action.result.brands,
            //cityList : processCityList(action.result.cities)
          }
    case INIT_FAIL:
          return {
            ...state,
            loading: false,
            loaded: false,
            loadingBrand : false,
            list: [],
            error: action.error
          }
    case CLEAR:
      return {
        initState
      }
    case DISABLE_APPEND:
          return {
            ...state,
            isEnd : true,
          }
    case CHANGE_LOCATION:
      return {
        ...state,
        locationId : action.id
      }
    case SET_COLUMN :
          return {
            ...state,
            column : action.number,
          }
    case CLEAR_DELETE_FEEDBACK:
          return {
            ...state,
            deleteFeedback : null,
          }
    default : return state;
  }
}

function processBrandList(brandList){
  var selectList = []
  brandList.forEach(function(brand, index){
    selectList.push({
      value : index,
      label : brand
    })
  })
  return selectList;
}

export function onGetHouseList(brandIndex, brandList){
  var brand = null
  if(brandIndex !== null) {
    brand = brandList[brandIndex].label.toLowerCase();
  }
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      let url;
      if(brand) {
        url = '/list/brand/' + brand
      }else{
        url ='/list'
      }
      return client.get(url)
    } // params not used, just shown as demonstration
  };
}

export function onInit(){
  return {
    types: [INIT, INIT_SUCCESS, INIT_FAIL],
    promise: (client) => {
      let  url = '/initList'
      return client.get(url)
    } // params not used, just shown as demonstration
  };
}

export function onAppendList(brandIndex, brandList, skipNumber){
  var brand = null
  if(brandIndex !== null) {
    brand = brandList[brandIndex].label.toLowerCase();
  }
  return {
    types: [LOAD, APPEND_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      let url;
      if(brand) {
        url = '/list/brand/' + brand + '?skip=' + skipNumber
      }else{
        url ='/list?skip=' + skipNumber
      }
      return client.get(url)
    } // params not used, just shown as demonstration
  };
}

export function onDisableAppend(){
  return {
    type : DISABLE_APPEND,
  }
}

export function onDeleteHouse(userId, houseId, index){
  return {
    index : index,
    types : [DELETE_HOUSE, DELETE_HOUSE_SUCCESS, DELETE_HOUSE_FAIL],
    promise : (client) => {
      var url = '/deleteHouse/' + userId +  "/" + houseId;
      return client.get(url)
    }
  }
}

export function onSetColumn(number){
  return {
    type : SET_COLUMN,
    number : number,
  }
}

export function onGetBrandList(){
  return {
    types: [CITY_LIST, CITY_LIST_SUCCESS, CITY_LIST_FAIL],
    promise : (client) => {
      var url = '/brandList';
      return client.get(url)
    }
  }
}

export function onNewSubmit(){
  return {
    types : [REFRESH_ALL, REFRESH_ALL_SUCCESS, REFRESH_ALL_FAIL],
    promise : (client) => {
      var url ='/newBrand'
      return client.get(url)
    }
  }
}

export function onClearDeleteFeedback(){
  return {
    type : CLEAR_DELETE_FEEDBACK,
  }
}

export function isLoaded(globalState) {
  return globalState.entities && globalState.entities.loaded;
}

export function onLocationChange(value){
  return {
    type : CHANGE_LOCATION,
    id : value,
  }
}

// to be added when we change location
function filterData(locationValue){

}

