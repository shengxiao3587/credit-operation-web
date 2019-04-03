import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import './index.scss';

export default class WithdrawDetail extends Component {
  componentDidMount() {
    this.load();
  }

  load = () => {
    this.props.detail({
      withdrawId: this.props.match.params.id,
    });
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  detail = (record) => (
    <div className="wd-wrap">
      <Spin spinning={this.props.loading}>
        <div className="wd-title">
          <div className="wd-titleName">提款信息</div>
          <div className="wd-topButtons">
            <Button icon="sync" onClick={this.refresh}>刷新</Button>
            <Button icon="rollback" onClick={this.back}>返回</Button>
          </div>
        </div>
        <div className="ant-row wd-row">
          {this.props.fields.map((item) => {
            let recordValue;
            if (record[item.name] === null) {
              recordValue = record[item.name];
            } else if (typeof record[item.name] !== 'object') {
              recordValue = record[item.name];
            } else {
              recordValue = record[item.name].value;
            }
            return (
              <div className="ant-col-12 wd-col" key={item.name}>
                <span className="wd-label">{item.label} : </span>{recordValue}
              </div>
            );
          })}
        </div>
        <div className="wd-lastCol">
          <span className="wd-label"> 到期应还款（港币）: </span>
          <span style={{ padding: '0 5px', color: '#62666C' }}>本金</span>
          <span style={{ color:'#F5222D' }}>{record.principal}</span>
          <span style={{ padding: '0 5px', color: '#62666C' }}>利息</span>
          <span style={{ color:'#F5222D' }}>{record.borrowAmount}</span>
        </div>
        <Button
          type="primary"
          onClick={this.back}
          style={{ margin:'25px 0 0 50px' }}
        >关闭
        </Button>
      </Spin>
    </div>
  );


  render() {
    const { data } = this.props;
    return (
      <div className="detail-main">
        {this.detail(data)}
      </div>
    );
  }
}
