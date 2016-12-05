import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {reduxForm} from 'redux-form';
import {clearLoginError, login} from 'redux/modules/auth';
import loginValidation from './loginValidation';
import {TextField, RaisedButton, Snackbar} from 'material-ui';
import uiStyles from '../../theme/uiStyles';
import imageAddress from '../../constant/imageAddress'
@connect(
  state => ({
    user: state.auth.user,
    loginError : state.auth.loginError,
    loggingIn : state.auth.loggingIn,
    loadError : state.auth.error,
  }),
  {clearLoginError, login})

@reduxForm({
  form: 'login',
  fields : ['username', 'password'],
  validate : loginValidation,
})

export default class Login extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    loggingIn: PropTypes.bool,
    loadError : PropTypes.object,
    loginError: PropTypes.string,
    user: PropTypes.object,
    login: PropTypes.func.isRequired,
    resetForm : PropTypes.func.isRequired,
    clearLoginError : PropTypes.func.isRequired,
  }

  handleSubmit = () => {
    this.props.login(this.props.fields.username.value, this.props.fields.password.value);
  }

  handleKeyPress = (event) => {
    if( event.key == 'Enter' ) {
      this.handleSubmit();
    }
  }

  render() {
    const {
      fields: {username, password},
      user, loggingIn, loginError, loadError
    } = this.props;
    const styles = require('./Login.scss');

    const inputStyle = uiStyles.inputStyle;
    const buttonStyle = uiStyles.buttonStyle;
    const anyError = username.error || password.error;

    const getError = ()=> {
      if(loginError != null){
        return loginError.error
      }else if(loadError != null){
        return loadError.code ? loadError.code : loadError.toString()
      }else{
        return ""
      }
    }

    return (
      <div className={styles.loginPage} onKeyPress={this.handleKeyPress}>
        <Helmet title="Login"/>
        {!user &&
        <div className={styles.container}>
          <div className={styles.loginForm}>
            <div className={styles.loginTitle}><h1>Login</h1></div>
            <form onSubmit={this.handleSubmit}>
              <div className={'form-group'}>
                <div>
                  <TextField type="text" hintText="Username" style={inputStyle}
                             floatingLabelText="Username"
                             errorText={username.touched && username.error ? username.error : null}  {...username}
                  />
                </div>
              </div>
              <div className={'form-group'}>
                <div>
                  <TextField type="password" hintText="Password" style={inputStyle}
                             floatingLabelText="Password"
                             errorText={password.touched && password.error ? password.error : null} {...password}
                  />
                </div>
              </div>
              <div className={styles.raisedButton}>
              <RaisedButton style style={buttonStyle} disabled={anyError ? true : false} onClick={this.handleSubmit}>
                {loggingIn ?
                  <span className="fa fa-spin fa-refresh"/>
                  :
                  <span>Los!</span>
                }
              </RaisedButton>
              </div>
              <Snackbar
                open={loginError != null || loadError != null}
                message={getError()}
                autoHideDuration={4000}
                bodyStyle={uiStyles.snackBarStyleRed}
                onRequestClose={(reason) => {
                  this.props.clearLoginError();
                }}
              />
            </form>
          </div>
          <div className={styles.loginPic}>
            <img src={imageAddress.loginImage}/>
          </div>
        </div>
        }
      </div>
    );
  }
}
