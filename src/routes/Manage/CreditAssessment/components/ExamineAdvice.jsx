import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Radio,
  DatePicker,
} from 'antd';
import { Number as InputNumber } from '@f12/components';
import './common.scss';
import './examine.scss';
import { currentTime } from '../modules';
import { formatMoney } from '../../../../util';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ExamineAdvice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examinResult: 1,
    };
    this.RangePicker = DatePicker.RangePicker;
  }

  fields = (fieldsConfig) => {
    const children = [];
    const { initialDateValue } = this.props.defaultData;
    const { getFieldDecorator } = this.props.form;
    const bottomFields = fieldsConfig[0].name === 'borrowDays';
    let formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
    };
    if (!bottomFields) {
      formItemLayout = {};
    }
    for (let i = 0; i < fieldsConfig.length; i += 1) {
      const field = fieldsConfig[i];
      const {
        dataIndex,
        addOnAfter,
        name,
        defaultValue,
        validator,
        hidden,
        type,
        reduce,
        precision,
        render,
        min,
        max,
        money,
      } = field;
      const disabled = name === 'togetherCurrency';
      const input = (
        type === 'number' ?
          (
            <InputNumber
              disabled={disabled}
              antdAddonAfter={addOnAfter}
              reduce={reduce}
              precision={precision}
              render={render}
              min={min}
              max={max}
              hidden={hidden}
              placeholder={`请输入${dataIndex}`}
              money={money}
            />
          ) : (
            <Input
              disabled={disabled}
              placeholder={`请输入${dataIndex}`}
              hidden={hidden}
              addonAfter={addOnAfter}
            />)
      );

      children[i] = (
        <Col span={8} key={i.toString()}>
          <FormItem
            label={dataIndex}
            className="examine-advice-item"
            {...formItemLayout}
          >
            {getFieldDecorator(name, {
              rules: [{
                pattern: /^.*$/,
                validator,
              }, {
                required: !disabled,
                message: `请输入${dataIndex}`,
              }],
              initialValue: defaultValue,
            })(input)}
          </FormItem>
        </Col>
      );
    }
    if (bottomFields) {
      children[children.length] = (
        <Col span={8} key="date">
          <FormItem
            label="授信期限"
            className="examine-advice-item"
            {...formItemLayout}
          >
            {getFieldDecorator('creditDate', {
              rules: [{
                required: true,
                message: '请输入授信期限',
              }],
              initialValue: initialDateValue,
            })(<this.RangePicker format="YYYY-MM-DD" />)}
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  timestamp = (time) => {
    const d = currentTime(time);
    return d.getTime();
  }

  examineResultChange = (event) => {
    this.setState({
      examinResult: event.target.value,
    });
  }

  handleExamine = (event) => {
    event.preventDefault();
    const {
      defaultData, form,
      submit, history,
    } = this.props;
    form.validateFields((err, values) => {
      const vs = values;
      if (!err) {
        if ('comment' in values) {
          const requiredNames = [
            'applyId',
            'rateType',
            'repayType',
          ];
          for (let i = 0; i < requiredNames.length; i += 1) {
            const requiredName = requiredNames[i];
            vs[requiredName] = defaultData[requiredName];
          }
          vs.status = 3;
        } else {
          const [start, end] = values.creditDate;
          vs.creditTimeStart = this.timestamp(start);
          vs.creditTimeEnd = this.timestamp(end);
          Object.keys(defaultData).forEach((name) => {
            let defaultValue = defaultData[name];
            if (name in vs) {
              defaultValue = vs[name];
            }
            if (typeof defaultValue === 'string' && name !== 'currency') {
              defaultValue = Number(defaultValue);
            }
            vs[name] = defaultValue;
          });
          vs.status = 2;
          delete vs.currencyName;
        }
        submit(vs).then((success) => {
          if (success) {
            history.goBack();
          }
        });
      }
    });
  }

  appendDefaultValue = (fieldsconfig, defaultData) => {
    fieldsconfig.forEach((config) => {
      const newConfig = config;
      const { name } = newConfig;
      let defaultValue = defaultData[name];
      if (defaultValue === null) {
        defaultValue = '';
      }
      newConfig.defaultValue = defaultValue;
    });
  }

  appendFieldRate(config) {
    const { compoundFlag, penaltyFlag } = this.props.defaultData;
    [
      {
        dataIndex: '复利利率',
        name: 'compoundRate',
        addOnAfter: '%',
        hidden: !compoundFlag,
        type: 'number',
        reduce: 0.01,
        precision: 6,
        render: (value) => formatMoney(value, 0.01, 6, true, 2, true),
      },
      {
        dataIndex: '罚息利率',
        name: 'penaltyRate',
        addOnAfter: '%',
        hidden: !penaltyFlag,
        type: 'number',
        reduce: 0.01,
        precision: 6,
        render: (value) => formatMoney(value, 0.01, 6, true, 2, true),
      },
    ].forEach((rate) => {
      if (!rate.hidden) {
        config.push(rate);
      }
    });
  }

  examineResultData = () => {
    const { defaultData, form, history } = this.props;
    const { currency, currencyName } = defaultData;
    defaultData.togetherCurrency = `${currency}${currencyName}`;
    const topFieldsConfig = [
      {
        dataIndex: '币种',
        name: 'togetherCurrency',
      },
      {
        dataIndex: '信用总额度',
        name: 'totalCreditLines',
        type: 'number',
        reduce: 100,
        min: 0.01,
        money: true,
        render: (value) => formatMoney(value, 100, 2, true, 2),
      },
    ];
    this.appendDefaultValue(topFieldsConfig, defaultData);
    const bottomFieldsConfig = [
      {
        dataIndex: '可借款天数',
        name: 'borrowDays',
        addOnAfter: '天',
        precision: 0,
        min: 1,
        max: 1000,
        type: 'number',
      },
      {
        dataIndex: '借款利率',
        name: 'borrowRate',
        addOnAfter: '%',
        type: 'number',
        reduce: 0.01,
        precision: 6,
        render: (value) => formatMoney(value, 0.01, 6, true, 2, true),
      },
    ];
    this.appendFieldRate(bottomFieldsConfig);
    this.appendDefaultValue(bottomFieldsConfig, defaultData);
    const result = this.state.examinResult === 1 ? (
      <div>
        <Row className="top-items" gutter={24}>{this.fields(topFieldsConfig)}</Row>
        <Row
          gutter={24}
          className="bottom-items"
          type="flex"
          justify="start"
        >
          {this.fields(bottomFieldsConfig)}
        </Row>
      </div>
    ) : (
      <FormItem label="" className="refuse-reason">
        {form.getFieldDecorator('comment', {
          rules: [{
            required: true,
            message: '请写下驳回原因',
          }, {
            max: 200,
            message: '驳回原因最大长度200字',
          }],
          initialValue: defaultData.comment,
        })(<Input.TextArea rows="6" cols="260" placeholder="请简要填写驳回原因" />)}
      </FormItem>
    );
    return (
      <Form
        className="examine-advice-content"
        onSubmit={this.handleExamine}
      >
        {result}
        <Row>
          <Col span={24} style={{ textAlign: 'left' }} className="button-wrapper">
            <Button onClick={() => { history.goBack(); }}>取消</Button>
            <Button type="primary" style={{ marginLeft: 24 }} htmlType="submit">
              确定
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className="examine-advice-main">
        <span className="advice-title">审批建议</span>
        <div className="examine-advice-form">
          <RadioGroup
            onChange={this.examineResultChange}
            value={this.state.examinResult}
            className="examine-radio"
          >
            <Radio value={1}>审核通过</Radio>
            <Radio value={2}>驳回</Radio>
          </RadioGroup>
          {this.examineResultData()}
        </div>
      </div>
    );
  }
}

const ExamineAdviceForm = Form.create()(ExamineAdvice);
export default ExamineAdviceForm;
