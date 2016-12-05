import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {pushState} from 'redux-router'
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {onClearLoadError, onClear as clearEntity} from 'redux/modules/entity'
import {onClearUpdate} from 'redux/modules/auth'
import {onClearLoadError as clearPostLoadError, onClear as clearPost} from 'redux/modules/post';
import config from './config.js'
import {
    App,
    Home,
    About,
    Login,
    NotFound,
    Register,
    Profile,
    Info,
    Company,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  const checkUser = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/admin');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  }

  const requireDev = (nextState, replaceState, cb) => {
    if(config.isDebug){
      cb()
    }
  }

  const logNextState = (nextState, replaceState, cb) => {
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home} onEnter={checkUser}/>


      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="admin" component={Profile}/>
        <Route path="main" component={Profile}/>
      </Route>

      { /* Routes */ }
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>


      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
