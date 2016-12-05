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
    contactError : state.error.error,
    feedback : state.auth.feedback,
    editing: state.auth.editing,
    cachedImages : state.auth.cachedImages,
    images : state.auth.user.images,

    contactEmail : state.auth.user.contactEmail,
    contactPhone : state.auth.user.contactPhone,
    contactWechat : state.auth.user.contactWechat,
    location : state.auth.user.location,
    description : state.auth.user.description,

    user : state.auth.user,
    userId : state.auth.user._id,
    loaded: state.admin.loaded,
    locationId : state.admin.locationId,
    deleteFeedback : state.admin.deleteFeedback,
  }),
  {onLoad, onSubmit, onClearMessage, onClearAllError}
)
export default class Entity extends Component {

  //componentDidMount() {
  //  this.setState({
  //    // route components are rendered with useful information, like URL params
  //  })
  //}
  static propTypes = {
    user: PropTypes.object,

    editing: PropTypes.bool,
    feedback : PropTypes.string,
    contactError : PropTypes.string,
    cachedImages : PropTypes.array,
    images : PropTypes.array,

    contactEmail : PropTypes.string,
    contactPhone : PropTypes.string,
    contactWechat : PropTypes.string,
    location : PropTypes.string,
    description : PropTypes.string,

    //editStart: PropTypes.func.isRequired,
    onClearAllError : PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClearMessage : PropTypes.func.isRequired,
  }


  handleSubmit = (data) => {
    /**
     //validate phone number
     if(data.phone && data.phone.indexOf("+") >= 0){
      data.phone = data.phone.slice(1)
    }**/
      // owner is included in entity
    data.images = this.props.images
    // here we define a _id for update in database
    data._id = this.props.userId

    const images = this.props.cachedImages
    this.props.onSubmit(data, images, this.props.userId);
    console.log("submit now with data:" , data)
    console.log("submit now with images:", images )
  }
  //save(values)
  //.then(result => {
  //  if (result && typeof result.error === 'object') {
  //    return Promise.reject(result.error);
  //  }
  //})

  render(){
    const {editing, feedback, contactError} = this.props;

    // for test case
    const test = false;
    const invalid = true;
    const submitting = false;

    const styles = require('./Company.scss');
    const getError = () =>{
      if(feedback != null)
        return feedback
      if(contactError != null)
        return contactError
      //else
      return ""
    }

    const renderMain = () => {
      if(editing){
        return <CompanyForm onSubmit={this.handleSubmit} entity={this.props.user}/>
      }else{
        return <CompanyTemplate entity={this.props.user} />
      }
    }

    return (
      <div>
        <Helmet title="公司信息"/>

        {renderMain()}

        <Snackbar
          open={feedback != null || contactError != null}
          message={ getError()}
          autoHideDuration={4000}
          bodyStyle={uiStyles.snackBarStyleBlue}
          onRequestClose={(reason) => {
            console.log('should open is', feedback != null || contactError != null)
            this.props.onClearMessage();
            this.props.onClearAllError();
          }}
        />
      </div>
    )
  }
}
