import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import './index.scss';


export default class CreditDetail extends Component {
  componentDidMount() {
    this.load();
  }

  load = () => {
    this.props.detail({
      linesId: this.props.location.state.linesId,
      entId: this.props.location.state.entId,
    });
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  detail = (record) => {
    const { fields } = this.props;
    fields[10].noHidden = this.isCompoundRateHidden();
    fields[11].noHidden = this.isPenaltyRateHidden();
    return (
      <div className="cd-wrap">
        <Spin spinning={this.props.loading}>
          <div className="cd-title">
            <div className="cd-titleName">额度信息</div>
            <div className="cd-topButtons">
              <Button icon="sync" onClick={this.refresh}>刷新</Button>
              <Button icon="rollback" onClick={this.back}>返回</Button>
            </div>
          </div>
          <div className="ant-row cd-row">
            {fields.map((item) => {
              let recordValue;
              if (record[item.name] === null) {
                recordValue = record[item.name];
              } else if (typeof record[item.name] !== 'object') {
                recordValue = record[item.name];
              } else {
                recordValue = record[item.name].value;
              }
              return (item.noHidden &&
                <div className="ant-col-12 cd-col" key={item.name}>
                  <span className="cd-label">{item.label} : </span>{recordValue}
                </div>
              );
            })}
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
  };

  isCompoundRateHidden = () => this.props.data.compoundFlag;

  isPenaltyRateHidden = () => this.props.data.penaltyFlag;


  render() {
    const { data } = this.props;
    return (
      <div className="detail-main">
        {this.detail(data)}
      </div>
    );
  }
}
