/**
 * Created by hanwencheng on 1/8/16.
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isLoaded, onLoad, onSubmit, onClearMessage} from "redux/modules/auth"
import {onClearAllError} from 'redux/modules/error';
import connectData from 'helpers/connectData';
import { CompanyForm, CompanyTemplate } from 'components';
import { NotFound } from 'containers';
import uiStyles from "../../theme/uiStyles";
import {Snackbar} from 'material-ui';
import Helmet from 'react-helmet';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(onLoad(getState().auth.user._id));
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    user : state.auth.user,
  }),
  {}
)
export default class Entity extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  dateFormat = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

  render(){
    const {user} = this.props;
    const styles = require('./Profile.scss')
    return (
      <div>
        <Helmet title="Profile"/>
        <div className={styles.container}>
          <div className={styles.list}>
            <div className={styles.innerList}>
              <div className={styles.rowContainer}><i className="fa fa-user"/>&nbsp; Username : &nbsp;&nbsp;  {user.username ?  user.username : "No Username"}</div>
              <div className={styles.rowContainer}><i className="fa fa-envelope"/>&nbsp; Email : &nbsp;&nbsp;  {user.email ?  user.email : "No Email"}</div>
              <div className={styles.rowContainer}><i className="fa fa-birthday-cake"/>&nbsp; Birth Date : &nbsp;&nbsp;  {user.birthDate ? this.dateFormat(new Date(user.birthDate)) : "No BirthDate"} </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
