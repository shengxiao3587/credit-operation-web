import React, { Component } from 'react';
import { message } from 'antd';
import fetch from '@f12/fetch';
import { DetailPage, ImagePreview } from '@f12/components';
import { parseFields, getUserBaseUrl, validatePassword } from '../../../../util';
import './style.scss';

const CryptoJS = require('../../../../../lib/crypto-js');

class View extends Component {
  constructor(props) {
    super(props);
    this.accessToken = localStorage.getItem('accessToken');
  }

  componentDidMount() {
    this.props.load();
  }

  passwordValidate = (rule, value, callback) => {
    const { form } = this.props;
    if (value && form.getFieldValue('confirmPassword')) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    validatePassword(value, callback);
    callback();
  };

  confirmPasswordValidate = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('nrePassword')) {
      callback('两次密码输入不一致');
    }
    validatePassword(value, callback);
    callback();
  };

  previewImg = (value, index, name) => {
    this.props.previewImg(true, [this.props.record.imageUrl.value], index, name);
  };

  refresh = () => {
    this.props.load();
  };

  validateOldPassword = (params) => {
    const url = `${getUserBaseUrl()}/account/login`;
    const key = CryptoJS.enc.Latin1.parse('eGluZ3Vhbmd0YmI=');
    const iv = CryptoJS.enc.Latin1.parse('svtpdprtrsjxabcd');
    const newParams = {
      ...params,
    };
    const p = {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    };
    const encrypted = CryptoJS.AES.encrypt(newParams.password, key, p);
    newParams.password = encrypted.toString();
    localStorage.removeItem('accessToken');
    return fetch(url, {
      ...newParams,
      type: 'username',
    });
  };

  submit = (form) => {
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        const oldPwd = form.getFieldValue('oldPassword');
        const { username } = JSON.parse(localStorage.getItem('user'));
        this.validateOldPassword({
          password: oldPwd,
          username,
        }).then((json) => {
          if (json.resultCode === '0') {
            localStorage.setItem('accessToken', this.accessToken);
            this.props.save(values).then((success) => {
              if (success) {
                this.props.load();
              }
            });
          } else {
            localStorage.setItem('accessToken', this.accessToken);
            message.error('旧密码不正确');
          }
        });
      }
    });
  };

  render() {
    const {
      record,
      changeRecord,
      fields,
      buttons,
      persistForm,
      topButtons,
      imgVisible,
      imgIndex,
      previewImg,
      currentImgs,
      loading,
    } = this.props;
    return (
      <div className="user-setting-container">
        <ImagePreview
          visible={imgVisible}
          images={currentImgs}
          hide={() => {
            previewImg(false, currentImgs, imgIndex);
          }}
          index={imgIndex}
        />
        <DetailPage
          values={record}
          changeRecord={changeRecord}
          fields={parseFields.call(this, fields)}
          buttons={parseFields.call(this, buttons)}
          persistForm={persistForm}
          topButtons={parseFields.call(this, topButtons)}
          topTitle="账户设置"
          loading={loading}
        />
      </div>
    );
  }
}

export default View;
