import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import { parseFields, validatePassword } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.dict('bankInstId');
    this.props.loadRole();
    this.load();
  }
  componentWillUnmount() {
    this.props.reset();
  }

  getBankData = () => {
    const data = this.props.dicts.bankInstId;
    if (data) {
      if (data[data.length - 1].value !== '0') {
        data.push({ label:'平台', value:'0' });
      }
    }
    return data;
  };
  getRoleData = () => this.props.roleData;

  passwordValidate = (rule, value, callback) => {
    const { form } = this.props;
    validatePassword(value, callback);
    if (value && form.getFieldValue('confirmPassword')) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  confirmPasswordValidate = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  };

  load() {
    const { id } = this.props.match.params;
    if (id !== 'new') {
      this.props.load({
        userId: id,
      });
    }
  }

  refresh = () => {
    this.load();
  };

  isEdit = () => this.props.match.params.id !== 'new';


  submit = (form) => {
    // force is important, as default the value not change won't validate the rules
    const { roleData } = this.props;
    const roles = [];
    let userId = '';
    if (this.props.match.params.id !== 'new') {
      userId = this.props.match.params.id;
    }
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      const newValues = values;
      if (!err) {
        newValues.roles.forEach((item) => {
          roleData.forEach((i) => {
            if (item === i.key) {
              roles.push({
                roleName: i.title,
                roleId: i.key,
              });
            }
          });
        });
        delete newValues.roles;
        this.props.save({ ...newValues, roles, userId }).then((success) => {
          if (success) {
            this.props.history.goBack();
          }
        });
      }
    });
  };
  back = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      record,
      changeRecord,
      fields,
      buttons,
      topButtons,
      persistForm,
    } = this.props;
    let topTitle = '新增用户';
    if (this.props.match.params.id !== 'new') {
      topTitle = '编辑用户';
    }
    return (
      <div style={{ width: '100%' }}>
        <DetailPage
          topTitle={topTitle}
          values={record}
          changeRecord={changeRecord}
          fields={parseFields.call(this, fields)}
          buttons={parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
          persistForm={persistForm}
        />
      </div>
    );
  }
}

export default View;
