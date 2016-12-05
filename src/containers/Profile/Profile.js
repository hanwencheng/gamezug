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

  //componentDidMount() {
  //  this.setState({
  //    // route components are rendered with useful information, like URL params
  //  })
  //}
  static propTypes = {
    user: PropTypes.object,
  }

  render(){
    const {user} = this.props;
    return (
      <div>
        <Helmet title="Profile"/>
        <div className={styles.list}>
          <div className={styles.innerList}>
            <div className={styles.rowContainer}><i className="fa fa-industry"/>Username : &nbsp;&nbsp;  {user.username ?  user.username : ""}</div>
            <div className={styles.rowContainer}><i className="fa fa-cubes"/> Email : &nbsp;&nbsp;  {user.email ?  user.email : ""}</div>
            <div className={styles.rowContainer}><i className="fa fa-link"/> Birth Date : &nbsp;&nbsp;  {user.email ? user.email : ""} </div>
          </div>
        </div>
      </div>
    )
  }
}
