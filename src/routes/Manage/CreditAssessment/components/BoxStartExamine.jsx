import React, { Component } from 'react';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import './box.scss';

export default class BoxStartExamine extends Component {
  constructor(props) {
    super(props);
    this.confirm = Modal.confirm;
  }

  jumpToExamine = () => {
    const {
      history,
      applyId,
    } = this.props;
    const query = `?applyId=${applyId}`;
    this.confirm({
      title: '由于企业征信查询为收费项目，查询前请仔细核对商家资质',
      onOk() {
        history.push(`/Manage/BigDataCreditReport${query}`);
      },
      okText: '我已核对',
    });
  }

  render() {
    const {
      tip,
      buttonText,
      applyId,
      reportId,
      reportTitle,
    } = this.props;
    const onsiteSurvey = buttonText.startsWith('发起现场尽调');
    const width = onsiteSurvey ? '132px' : '160px';
    const buttonStyle = {
      background: '#E6B981',
      height: '36px',
      width,
      color: 'white',
    };
    const to = {
      pathname:`/Manage/OnsiteSurvey/${applyId}`,
      state: {
        applyId,
        surveyId: reportId,
        detail: false,
      },
    };
    const button = onsiteSurvey ? (
      <Link
        to={to}
        className="button-open-report button-link"
        style={buttonStyle}
      >
        {buttonText}
      </Link>
    ) : (
      <button
        style={buttonStyle}
        type="primary"
        onClick={this.jumpToExamine}
        className="button-open-report"
      >
        {buttonText}
      </button>
    );
    return (
      <div className="box-start-examine-main">
        <span className="credit-cell-title">{reportTitle}</span>
        <div className="box-start-examine">
          <div className="box-start-examine-content">
            {button}
            <p>{tip}</p>
          </div>
        </div>
      </div>
    );
  }
}
