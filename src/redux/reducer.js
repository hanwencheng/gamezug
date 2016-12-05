import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import auth from './modules/auth';
import {reducer as form} from 'redux-form';
import info from './modules/info';
import entities from './modules/entities';
import entity from './modules/entity'
import submit from './modules/submit'
import admin from './modules/admin'
import error from './modules/error'
import posts from './modules/posts'
import post from './modules/post'
import memos from './modules/memos'
import company from './modules/company'

export default combineReducers({
  router: routerStateReducer,
  auth,
  form,
  info,
  entities,
  entity,
  submit,
  admin,
  error,
  post,
  posts,
  memos,
  company,
});
