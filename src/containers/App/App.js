import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, div } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout, clearLoginError , onClearUpdate, onUserUpdate} from 'redux/modules/auth';
import { onAddData } from 'redux/modules/admin';
import { onGetHouseList, onGetBrandList, onNewSubmit} from 'redux/modules/entities'
import { onGetPostList } from 'redux/modules/posts'
//import { InfoBar } from 'components';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import {FlatButton, FontIcon} from 'material-ui';
import uiStyles from '../../theme/uiStyles';
import ga from 'react-google-analytics';
const GAInitiailizer = ga.Initializer;
import defaultCityList from '../../constant/cityList';

// it must be enabled before react 1.0 for material ui

//load authentication data when loaded
function fetchData(getState, dispatch) {
  const promises = [];
  if (!isInfoLoaded(getState())) {
    promises.push(dispatch(loadInfo()));
  }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({
    user: state.auth.user,
    updated : state.auth.updated,
    adminLoaded : state.admin.loaded,
    createData : state.entity.createData,
    locationId : state.entities.locationId,
    brandList : state.entities.brandList,
    postCreateData : state.post.createData,
    postLocationId : state.posts.locationId,
  }),
  {logout, clearLoginError, pushState, onGetHouseList, onAddData, onGetBrandList,
    onNewSubmit, onGetPostList, onClearUpdate, onUserUpdate})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    updated : PropTypes.bool,
    createId : PropTypes.string,
    locationId : PropTypes.number,
    adminLoaded : PropTypes.bool,
    brandList :PropTypes.array,

    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    clearLoginError: PropTypes.func.isRequired,
    onGetHouseList : PropTypes.func.isRequired,
    onGetPostList : PropTypes.func.isRequired,
    onGetBrandList : PropTypes.func.isRequired,
    onAddData : PropTypes.func.isRequired,
    onNewSubmit : PropTypes.func.isRequired,
    onClearUpdate: PropTypes.func.isRequired,
    onUserUpdate: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  //automatically redirect
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.clearLoginError();
      this.props.pushState(null, '/main');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }

    if(!this.props.createData && nextProps.createData){
      this.props.pushState(null, '/entities/' + nextProps.createData._id)
      // refresh the main list
      //console.log('brandList is', this.props.brandList, 'the searching object is', nextProps.createData.brand)
      if(!this.props.brandList.some(function(brandObject){
          return brandObject.brand === nextProps.createData.brand
        })){
        //console.log('cannot find the submit brand , now refresh the list')
        this.props.onNewSubmit(null);//also change locationId here
      }else{
        console.log('find the submit brand , now only refresh the current list')
        this.props.onGetHouseList(this.props.locationId, this.props.brandList)
      }

      //refresh admin list
      if(this.props.adminLoaded){
        this.props.onAddData(nextProps.createData)
      }
    }

    if(this.props.user && nextProps.updated){
      this.props.onUserUpdate(this.props.user._id);
      console.log("now the updated should be cleared")
      this.props.onClearUpdate()
    }

    //if(!this.props.postCreateData && nextProps.postCreateData){
    //  this.props.pushState(null, '/posts/' + nextProps.postCreateData._id)
    //
    //  this.props.onGetPostList(this.props.postLocationId, defaultCityList)

      //TODO refresh admin list
      //if(this.props.adminLoaded){
      //  this.props.onAddData(nextProps.createData)
      //}
    //}
  }

  handleClick = (e) => {
    //console.log("click", e);
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');
    const rightLi = styles.links + " " + styles.hvrBuzzOut;
    ga('create', 'UA-60973146-2', 'auto');
    ga('send', 'pageview');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <GAInitiailizer />
        <div className={styles.navbar}>
          <div className={styles.left}>
            <div className={styles.logoContainer}>
              <LinkContainer to="/">
                <div className={styles.logo}>
                    <img className={styles.hvrWobbleSkew} src={require('../../../static/zhensys.png')}/>
                </div>
              </LinkContainer>

              <LinkContainer to="/">
                <div className={styles.title}>
                  <div className={styles.headerSchrift}>
                    {config.app.title}
                  </div>
                </div>
              </LinkContainer>
            </div>

            <div className={styles.buttonContainer}>
              {!user &&
              <FlatButton eventKey={2} linkButton={true} containerElement={<Link to="/login" />} label="登录"/>
              }

              {!user &&
              <FlatButton labelStyle={uiStyles.registerButton} eventKey={4} label="注册"
                          linkButton={true} containerElement={<Link to="/register" />}/>
              }

              <FlatButton containerElement={<Link to="/about" />}
                          linkButton={true} eventKey={7} label="关于我们"/>

              {/*{user &&
              <FlatButton eventKey={1} linkButton={true} containerElement={<Link to="/chat" />} label="聊天室"/>
              }*/}

              {user &&
              <FlatButton eventKey={10} linkButton={true} containerElement={<Link to="/main" />} label="产品目录"/>
              }

              {user &&
              <FlatButton eventKey={9} linkButton={true} containerElement={<Link to="/info" />} label="查询"/>
              }

            </div>

          </div>
          {user &&
          <div className={ user ? styles.right : styles.right + " " + styles.noUserRight}>
            <div className={styles.welcome}><span className={rightLi}><i className="fa fa-child"/> <strong className={styles.username}>{user.username}</strong></span></div>
            <LinkContainer to="/admin">
              <FlatButton eventKey={3}><span className={rightLi}><i className="fa fa-truck fa-lg"/>产品管理</span></FlatButton>
            </LinkContainer>
            <LinkContainer to="/company">
              <FlatButton eventKey={9}><span className={rightLi}><i className="fa fa-rocket fa-lg"/>厂家信息</span></FlatButton>
            </LinkContainer>
            <LinkContainer to="/submit">
              <FlatButton eventKey={6}><span className={rightLi}><i className="fa fa-pencil fa-lg"/>提交新产品</span></FlatButton>
            </LinkContainer>

            <LinkContainer to="/logout">
              <FlatButton eventKey={8} onClick={this.handleLogout}><span className={rightLi}><i className="fa fa-sign-out fa-lg" /> 登出</span></FlatButton>
            </LinkContainer>
          </div>}
        </div>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <div className={styles.bottomText}>
          <p>
            Please feel free to give us some <a href="mailto: softlipaschara@gmail.com">Feedback</a>.<br />

        All rights reserved &copy; 2016 Zhensys
          </p>
        </div>
      </div>
    );
  }
}
