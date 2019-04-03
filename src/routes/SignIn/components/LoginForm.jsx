/* eslint-disable semi,no-undef */
import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { validatePassword } from '../../../util';

const FormItem = Form.Item;

const createFormItem = (opts) => {
  const rules = [];
  if (opts.require) {
    rules.push({ required: true, message: `请输入${opts.label}` });
  }
  if (opts.max) {
    rules.push({ max: opts.max, message: `${opts.label}必须小于${opts.max}个字符` });
  }
  if (opts.min) {
    rules.push({ min: opts.min, message: `${opts.label}必须大于${opts.min}个字符` });
  }
  if (opts.pattern) {
    rules.push({ pattern: opts.pattern, message: opts.patternMsg });
  }
  if (opts.validator) {
    rules.push({ validator: opts.validator });
  }
  return opts.getFieldDecorator(opts.name, {
    rules,
  })(<Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />);
};

class LoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="login-logo"><img alt="" src="/logo-2.png" /></div>
        <div className="login-logo-text">FinTrack管理后台</div>
        <FormItem>
          {createFormItem({
            getFieldDecorator,
            require: true,
            icon: 'user',
            type: 'text',
            label: '账号',
            name: 'username',
            max: 50,
            pattern: /^[0-9A-Za-z\u4E00-\u9FA5\uF900-\uFA2D@.]*$/,
            patternMsg: '账号支持英文、中文、数字，不支持空格',
          })}
        </FormItem>
        <FormItem>
          {createFormItem({
            getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'password',
            label: '密码',
            name: 'password',
            validator: (rule, value, callback) => {
              validatePassword(value, callback);
            },
          })}
        </FormItem>
        <p className="password-forget">忘记密码？</p>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.loading}>
            登录
          </Button>
        </FormItem>
        <p className="text-copyright">
          技术支持：浙江兔巢科技有限公司
        </p>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);
