/**
 * Created by hanwencheng on 1/8/16.
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isLoaded, onLoad, onClear, onSubmit, onClearMessage} from "redux/modules/memos"
import {onClearAllError} from 'redux/modules/error';
import connectData from 'helpers/connectData';
import { SubmitForm } from 'components';
import { SubmitTemplate } from 'components';
import { NotFound } from 'containers';
import uiStyles from "../../theme/uiStyles";
import {Snackbar} from 'material-ui';
import Helmet from 'react-helmet';
import {Memos} from 'components'

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    console.log("nothing load, after load we get state:" + getState().router.params.entityId )
    return dispatch(onLoad(getState().router.params.entityId));
  }
}

//get the params only after page loaded
function checkState(getState, dispatch){

}

@connectData(
  checkState, fetchDataDeferred
)
@connect(
  state => ({
    loadError : state.memos.loadError,
    entity: state.memos.data,
    cachedImages : state.memos.cachedImages,
    error: state.memos.error,
    loading: state.memos.loading,
    editing: state.memos.editing,
    loadedId : state.memos.loadedId,
    feedback : state.memos.feedback,
    entityId : state.router.params.entityId,
    contactError : state.error.error,
  }),
  {onLoad, onClear, onSubmit, onClearMessage, onClearAllError}
)
export default class Entity extends Component {

  //componentDidMount() {
  //  this.setState({
  //    // route components are rendered with useful information, like URL params
  //  })
  //}
  static propTypes = {
    entity: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.bool,
    cachedImages : PropTypes.array,
    loadedId : PropTypes.string,
    feedback : PropTypes.string,
    entityId : PropTypes.string,
    contactError : PropTypes.string,
    loadError : PropTypes.string,

    //editStart: PropTypes.func.isRequired,
    onClearAllError : PropTypes.func.isRequired,
    onClear : PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClearMessage : PropTypes.func.isRequired,
  }
  render(){
    const {loading, editing, feedback, contactError} = this.props;

    // for test case
    const test = false;
    const invalid = true;
    const submitting = false;

    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Info.scss');
    const getError = () =>{
      if(feedback != null)
        return feedback
      if(contactError != null)
        return contactError
      //else
      return ""
    }

    const renderMain = () => {
      if(this.props.loadError){
        return <NotFound/>
      }else{
        return <SubmitTemplate entity={this.props.entity}/>
      }
    }

    return (
      <div>
        <Helmet title="产品信息"/>

        {renderMain()}

        <Memos memos={this.props.entity.memos} />

        <Snackbar
          open={feedback != null || contactError != null}
          message={ getError()}
          autoHideDuration={4000}
          bodyStyle={uiStyles.snackBarStyleBlue}
          onRequestClose={(reason) => {
            this.props.onClearMessage();
            this.props.onClearAllError();
          }}
        />
      </div>
    )
  }
}
