import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import WrappedNormalLoginForm from './LoginForm';
import './style.scss';

class View extends Component {
  login(values) {
    this.props.login(values).then((success) => {
      if (success) {
        this.props.check().then((s) => {
          if (s) {
            this.props.loadMenu();
            this.props.loadInfo();
          }
        });
      }
    });
  }

  render() {
    if (localStorage.getItem('accessToken') && this.props.checked === true) {
      return (<Redirect to={{
        pathname: '/Manage',
      }}
      />);
    }

    return (
      <div className="login-main">
        <div className="login-left flex flex-c">
          <div className="logo-word">
            <div>
              <img alt="" src="/logo-word.png" />
            </div>
            专注为国内跨境卖家提供跨境供应链金融服务的数字化服务平台
          </div>
        </div>
        <div className="login-right flex flex-c">
          <div className="login-form-wrapper">
            <WrappedNormalLoginForm
              login={this.login.bind(this)}
              loading={this.props.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default View;
