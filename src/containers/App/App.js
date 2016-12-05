import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, div } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout, clearLoginError , onClearUpdate, onUserUpdate} from 'redux/modules/auth';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import {FlatButton, FontIcon} from 'material-ui';
import uiStyles from '../../theme/uiStyles';

//load authentication data when loaded
function fetchData(getState, dispatch) {
  const promises = [];
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
  {logout, clearLoginError, pushState, onClearUpdate, onUserUpdate})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    adminLoaded : PropTypes.bool,
    clearLoginError: PropTypes.func.isRequired,
    onUserUpdate: PropTypes.func.isRequired,
    onClearUpdate: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  //automatically redirect
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.clearLoginError();
      this.props.pushState(null, '/admin');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }

    if(this.props.user && nextProps.updated){
      this.props.onUserUpdate(this.props.user._id);
      console.log("now the updated should be cleared")
      this.props.onClearUpdate()
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');
    const rightLi = styles.links + " " + styles.hvrBuzzOut;

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <div className={styles.navbar}>
          <div className={styles.left}>
            <div className={styles.logoContainer}>
              <LinkContainer to="/">
                <div className={styles.logo}>
                    <img className={styles.hvrWobbleSkew} src={require('../../../static/aeria-logo.svg')}/>
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
              <FlatButton eventKey={2} linkButton={true} containerElement={<Link to="/login" />} label="Login"/>
              }

              {!user &&
              <FlatButton labelStyle={uiStyles.registerButton} eventKey={4} label="Register"
                          linkButton={true} containerElement={<Link to="/register" />}/>
              }

              <FlatButton containerElement={<Link to="/about" />}
                          linkButton={true} eventKey={7} label="About"/>

            </div>

          </div>
          {user &&
          <div className={ user ? styles.right : styles.right + " " + styles.noUserRight}>
            <div className={styles.welcome}><span className={rightLi}><i className="fa fa-child"/> <strong className={styles.username}>{user.username}</strong></span></div>
            <LinkContainer to="/admin">
              <FlatButton eventKey={3}><span className={rightLi}><i className="fa fa-truck fa-lg"/>Profile</span></FlatButton>
            </LinkContainer>
            <LinkContainer to="/logout">
              <FlatButton eventKey={8} onClick={this.handleLogout}><span className={rightLi}><i className="fa fa-sign-out fa-lg" /> Logout</span></FlatButton>
            </LinkContainer>
          </div>}
        </div>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <div className={styles.bottomText}>
          <p>
            Please feel free to give us some <a href="mailto: heawen.cheng@gmail.com">Feedback</a>.<br />

        All rights reserved &copy; 2016 Hanwen Cheng
          </p>
        </div>
      </div>
    );
  }
}
