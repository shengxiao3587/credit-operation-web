import React, { Component } from 'react';
import { Menu, Col, Row } from 'antd';
import './detail.scss';
import './common.scss';

export default class CreditDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: 'info-base',
    };
  }

  handleClick = (event) => {
    this.currentContent(event.key);
    this.setState({
      currentKey: event.key,
    });
  }

  table = (rows, data) => {
    const jsx = [];
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const style = i % 2 !== 0 ? {
        background: 'white',
      } : null;
      jsx[i] = (
        <Row key={i.toString()} className="table-cell" style={style}>
          <Col span={8}>
            <span className="cell-name">{row.name1}</span>
            <span>{data[row.dataIndex1]}</span>
          </Col>
          <Col span={8}>
            <span className="cell-name">{row.name2}</span>
            <span>{data[row.dataIndex2]}</span>
          </Col>
          <Col span={8}>
            <span className="cell-name">{row.name3}</span>
            <span>{data[row.dataIndex3]}</span>
          </Col>
        </Row>
      );
    }
    return jsx;
  }

  tables = (params) => {
    const { rows, datas, titles } = params;
    return rows.map((row, index) => {
      const data = datas[index];
      const style = titles[index] === '' ? {
        padding: '5px',
      } : {
        padding: '18px',
      };
      return (
        <div key={index.toString()}>
          <p className="table-title" style={style}>{titles[index]}</p>
          {this.table(row, data)}
        </div>
      );
    });
  }

  basicTableParams = () => {
    const {
      basicInfoRows,
      basicInfoData,
      shareholderData,
      shareholderRows,
      personRows,
      personData,
    } = this.props;
    const params = {};
    let [shareholder1, shareholder2] = shareholderData;
    let [person1, person2] = personData;
    if (JSON.stringify(shareholderData) === '[]') {
      shareholder1 = {};
      shareholder2 = {};
      person1 = {};
      person2 = {};
    }
    params.rows = [
      basicInfoRows,
      shareholderRows,
      shareholderRows,
      personRows,
      personRows,
    ];
    params.datas = [
      basicInfoData,
      shareholder1,
      shareholder2,
      person1,
      person2,
    ];
    params.titles = ['企业照面信息', '股东信息', '', '高管信息', ''];
    return params;
  }

  riskTableParams = () => {
    const {
      loseCreditPersonRows,
      judgmentRows,
      limitHighPurchaseRows,
    } = this.props;
    const params = {};
    params.rows = [
      judgmentRows,
      loseCreditPersonRows,
      limitHighPurchaseRows,
    ];
    params.datas = [
      {},
      {},
      {},
    ];
    params.titles = ['判决文书', '失信被执行人', '限制高消费被执行人'];
    return params;
  }

  currentContent = (key) => {
    const basicTableParams = this.basicTableParams();
    const riskTableParams = this.riskTableParams();
    if (key === 'info-base') {
      return (
        <div className="table-main">
          {this.tables(basicTableParams)}
        </div>
      );
    } else if (key === 'info-loan') {
      return (
        <div className="table-main">
          {this.tables(riskTableParams)}
        </div>
      );
    }
    return null;
  }

  render() {
    const { currentKey } = this.state;
    return (
      <div className="credit-detail">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[currentKey]}
          mode="horizontal"
          className="menu"
        >
          <Menu.Item key="info-base">
            基础信息
          </Menu.Item>
          <Menu.Item key="info-loan">
            风险信息
          </Menu.Item>
        </Menu>
        {this.currentContent(currentKey)}
      </div>
    );
  }
}
