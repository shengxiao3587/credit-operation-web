import React from 'react';
import { Button, Row, Col } from 'antd';
import CreditDetail from './CreditDetail';
import ReportAdviceForm from './ReportAdvice';
import { imagePath } from '../../../../util';
import './index.scss';

class View extends React.Component {
  constructor(props) {
    super(props);
    const { applyId, censorId } = this.parsedQueryString();
    this.applyId = applyId;
    this.censorId = censorId;
  }

  componentDidMount() {
    this.load();
  }

  load() {
    this.props.fetchReportContent({
      applyId: this.applyId,
      censorId: this.censorId,
    });
  }

  parsedQueryString = () => {
    let { search } = this.props.location;
    search = search.slice(1);
    const queryStrings = search.split('&');
    const result = {};
    for (let i = 0; i < queryStrings.length; i += 1) {
      const queryString = queryStrings[i];
      const [key, value] = queryString.split('=');
      result[key] = value;
      if (result[key] === 'undefined') {
        result[key] = '';
      }
    }
    return result;
  }

  queryRegistrationTable = () => {
    const { reportContent, tableConfig } = this.props;
    return tableConfig.map((cell, index) => {
      const {
        leftDisplayName,
        leftFieldName,
        rightDisplayName,
        rightFieldName,
      } = cell;
      const style = index % 2 !== 0 ? ({
        background: 'white',
      }) : null;
      return (
        <Row key={index.toString()} className="table-cell" style={style}>
          <Col span={12}>
            <span className="display-name">{leftDisplayName}</span>
            <span>{reportContent[leftFieldName]}</span>
          </Col>
          <Col span={12}>
            <span className="display-name">{rightDisplayName}</span>
            <span>{reportContent[rightFieldName]}</span>
          </Col>
        </Row>
      );
    });
  }

  riskSummary = (riskSummary) => {
    return riskSummary.map((risk, index) => {
      return (
        <Col
          span={8}
          key={index.toString()}
          style={{
            background: 'white',
            lineHeight: '30px',
          }}
        >
          <span>{risk}</span>
        </Col>
      );
    });
  }

  render() {
    const {
      basicInfoRows,
      basicInfoData,
      shareholderData,
      shareholderRows,
      personData,
      personRows,
      judgmentRows,
      loseCreditPersonRows,
      location,
      limitHighPurchaseRows,
      entRiskSummary,
      personRiskSummary,
    } = this.props;
    const {
      entName,
      operateTime,
      reportNo,
      status,
      censorId,
    } = this.props.reportContent;
    const { goBack } = this.props.history;
    const reportAdviceForm = location.hash !== '#detail' ?
      (
        <div id="id-div-report-advice">
          <ReportAdviceForm
            match={this.props.match}
            submit={this.props.submit}
            applyId={this.applyId}
            censorId={censorId}
            history={this.props.history}
          />
        </div>
      ) : null;
    return (
      <div id="id-div-view">
        <div id="id-div-view-main">
          <p className="section-title">大数据征信</p>
          <div id="id-div-top-buttons">
            <Button icon="sync" onClick={() => { this.load(); }}>刷新</Button>
            <Button icon="rollback" onClick={() => { goBack(); }}>返回</Button>
          </div>
          <img alt="" className="image-status" src={imagePath()[status]} />
          <p id="id-p-side-title">{entName}</p>
          <div id="id-div-small-content">
            <div className="small-cell">
              <span className="cell-name">报告编号</span>
              <span>{reportNo}</span>
            </div>
            <div className="small-cell">
              <span className="cell-name">查询时间</span>
              <span>{operateTime}</span>
            </div>
          </div>
          <div className="table-main">
            {this.queryRegistrationTable()}
          </div>
          <p className="section-title">企业风险概览</p>
          <div className="risk-main">
            {this.riskSummary(entRiskSummary)}
          </div>
          <p className="section-title">个人风险概览</p>
          <div className="risk-main">
            {this.riskSummary(personRiskSummary)}
          </div>
          <CreditDetail
            basicInfoData={basicInfoData}
            basicInfoRows={basicInfoRows}
            shareholderData={shareholderData}
            shareholderRows={shareholderRows}
            personData={personData}
            personRows={personRows}
            judgmentRows={judgmentRows}
            loseCreditPersonRows={loseCreditPersonRows}
            limitHighPurchaseRows={limitHighPurchaseRows}
          />
        </div>
        {reportAdviceForm}
      </div>
    );
  }
}

export default View;
