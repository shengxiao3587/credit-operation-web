import React, { Component } from 'react';
import { Form, Radio, Input, Button } from 'antd';
import './common.scss';
import './advice.scss';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class ReportAdvice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 2,
    };
  }

  handleResultChange = (event) => {
    this.props.form.setFieldsValue({
      status: event.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const vs = values;
      const { applyId, censorId } = this.props;
      if (!err) {
        vs.applyId = applyId;
        vs.censorId = censorId;
        this.props.submit(vs).then((success) => {
          if (success) {
            this.props.history.goBack();
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const radios = (
      <RadioGroup onChange={this.handleResultChange}>
        <Radio value={2}>建议通过</Radio>
        <Radio value={3}>拒绝</Radio>
      </RadioGroup>
    );
    const message = '请填写意见';
    return (
      <div className="report-advice">
        <p className="section-title">征信报告建议</p>
        <div className="report-advice-main">
          <Form className="form-advice" onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('status', {
                initialValue: this.state.result,
              })(radios)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('comment', {
                rules: [{
                  required: true,
                  message,
                }, {
                  max: 500,
                  message: '意见最多500字',
                }],
              })(<TextArea rows="4" placeholder={message} />)}
            </FormItem>
            <div className="form-buttons">
              <Button onClick={() => { this.props.history.goBack(); }}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const ReportAdviceForm = Form.create()(ReportAdvice);
export default ReportAdviceForm;
