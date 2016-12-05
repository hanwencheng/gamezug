/**
 * Created by hanwencheng on 1/13/16.
 */

import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import registerValidation from './registerValidation';
import {check as checkEmail} from 'redux/modules/auth';
import {TextField, RaisedButton, DatePicker} from 'material-ui';
import uiStyles from '../../theme/uiStyles';

const enableAsyncCheck = false;
const asyncValidate = (value, dispatch) => {
  if(enableAsyncCheck){
    //return new Promise((resolve, reject) =>{
    //
    //})
    return dispatch(checkEmail(value))
  }

  return new Promise((resolve, reject) => {
    //console.log('sync validate value is disable now.')
    resolve()
  })
}

@connect(
  state => ({
    loggingIn: state.auth.loggingIn,
    initialValues : state.auth.data,
  }),
  {}
)

@reduxForm({
  form: 'register',
  fields : ['email', 'username', 'password', 'passwordRepeat', 'birthDate'],
  validate : registerValidation,
  asyncValidate,
  asyncBlurFields: ["email", "name"],
})

export default class RegisterForm extends Component{
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    loggingIn: PropTypes.bool.isRequired
  }

  dateFormat = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

  render() {
    const styles = require('./RegisterForm.scss');
    const {
      fields: {email, username, password, passwordRepeat, birthDate},
      resetForm,
      handleSubmit,
      asyncValidating,
      loggingIn} = this.props;
    var isPasswordSame = password.value && passwordRepeat.value && passwordRepeat.value === password.value;

    const inputStyle = uiStyles.inputStyle;
    const buttonStyle = uiStyles.buttonStyle;
    var anyError = email.error || username.error || password.error ||passwordRepeat.error || !isPasswordSame;

    const getError = ()=>{
      if(passwordRepeat.touched){
        if(passwordRepeat.error){
          return passwordRepeat.error
        }else if(password.touched && !isPasswordSame){
          return "Password is not same";
        }
      }
      return null;
    }

    return (
    <form className={styles.registerForm} onSubmit={handleSubmit}>
      <div className={'form-group'}>
        <div>
          <TextField type="text" hintText="Email" style={inputStyle} floatingLabelText="Email"
                     errorText={email.touched && email.error ? email.error : null}  {...email}/>
        </div>
      </div>
      <div className={'form-group'}>
        <div>
          <TextField type="text" hintText="Username" style={inputStyle} floatingLabelText="Username"
                     errorText={username.touched && username.error ? username.error : null} {...username}/>
          {asyncValidating === 'username' && <i /* spinning cog *//>}
        </div>
      </div>
      <div className={'form-group'}>
        <div>
          <TextField type="password" hintText="Password" style={inputStyle} floatingLabelText="Password"
                     errorText={password.touched && password.error ? password.error : null} {...password}/>
        </div>
      </div>
      <div className={'form-group'}>
        <div>
          <TextField type="password" hintText="Repeat Password" style={inputStyle} floatingLabelText="Repeat Password"
                     errorText={getError()} {...passwordRepeat}/>
        </div>
      </div>

      <div className='form-group'>
        <DatePicker autoOk={true} value={new Date(birthDate.value)} hintText="Birth Date"
                    onChange={(event, newDate) => birthDate.onChange(newDate)} formatDate={this.dateFormat}/>
      </div>
      <div className={styles.buttonGroup}>
        <RaisedButton disabled={anyError ? true : loggingIn} style={buttonStyle} onClick={handleSubmit}>
          {loggingIn ?
            <span className="fa fa-spin fa-refresh"/>
            :
            <span>Submit</span>
          }
        </RaisedButton>
        {/*<RaisedButton disabled={loggingIn} secondary={true} style={buttonStyle} onClick={resetForm}>
          Clear Values
        </RaisedButton>*/}
      </div>
    </form>
    );
  }
}