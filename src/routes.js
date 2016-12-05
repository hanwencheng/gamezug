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
    Chat,
    Home,
    About,
    Login,
    LoginSuccess,
    NotFound,
    Entities,
    Entity,
    Posts,
    Post,
    Register,
    Submit,
    SubmitPost,
    UserAdmin,
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
        replaceState(null, '/main');
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
    const entityNow = store.getState().entity;
    const postNow = store.getState().post;


    //only clear cache if the id is not the same as before
    //check if the entity is found or is duplicated
    console.log('load entity error is', entityNow.loadError, 'and post error is', postNow.loadError)
    if(entityNow.loadError){
      store.dispatch(onClearLoadError())
    }
    if(entityNow.loaded && entityNow.loadedId !== nextState.params.entityId) {
      //console.log('post should be cleared')
      store.dispatch(clearEntity())
    }

    //check if the post is found or is duplicated
    if(postNow.loadError){
      store.dispatch(clearPostLoadError())
    }
    if(postNow.loaded && postNow.postId !== nextState.params.postId) {
      //console.log('post should be cleared')
      store.dispatch(clearPost())
    }
    //console.log('should not be cleared, keep old')
    cb();
  };

  const updateAuth = (nextState, replaceState, cb) => {
    const authNow = store.getState().auth;
    console.log("auth state now is", authNow)
    if(authNow.updated){
      console.log('=======updated should be clear')
      store.dispatch(onClearUpdate())
    }
  }

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home} onEnter={checkUser}/>


      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
        <Route path="submit" component={Submit}/>
        <Route path="admin" component={UserAdmin}/>
        <Route path="submitPost" component={SubmitPost}/>
      </Route>

      { /* Routes */ }
      <Route path="main" component={About}/>
      <Route path="about" component={About}/>
      <Route path="info" component={Info}/>
      <Route path="company" component={Company}/>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>


      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
