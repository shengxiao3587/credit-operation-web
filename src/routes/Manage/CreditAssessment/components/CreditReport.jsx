import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import { imagePath } from '../../../../util';
import './report.scss';

export default class CreditReport extends Component {
  constructor(props) {
    super(props);
    this.reportBigData = this.props.reportTitle === '大数据征信报告';
    this.displayNames = this.contentNames('displayName');
    this.fieldNames = this.contentNames('fieldName');
    const { comment, buttonMoreVisible } = this.commentContent(this.props.reportValues);
    this.state = {
      comment,
      buttonMoreVisible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { comment, buttonMoreVisible } = this.commentContent(nextProps.reportValues);
    this.setState({
      comment,
      buttonMoreVisible,
    });
  }

  commentContent = (reportValues) => {
    let { comment } = reportValues;
    if (this.reportBigData && comment !== null) {
      comment = comment.length > 100 ? comment.slice(0, 100) : comment;
      const buttonMoreVisible = reportValues.comment.length > 100;
      return {
        comment,
        buttonMoreVisible,
      };
    }
    return {};
  }

  contentNames = (string) => this.props.fields.map((field) => field[string]);

  reportSideTitle = () => {
    return this.displayNames.slice(0, 2).map((displayName, index) => {
      const key = index.toString();
      return (
        <div className="side-title" key={key}>
          <span className="display-name">{displayName}</span>
          <span>{this.props.reportValues[this.fieldNames[index]]}</span>
        </div>
      );
    });
  }

  surveyors = () => {
    if (!this.reportBigData) {
      const transformed = this.props.reportValues.surveyors.split(',');
      return transformed.map((surveyor, index) => {
        const partition = index === transformed.length - 1 ? '' : '、';
        const value = `${surveyor}${partition}`;
        return (
          <span key={index.toString()}>{value}</span>
        );
      });
    }
    return null;
  }

  displayCommentAll = () => {
    const { comment } = this.props.reportValues;
    this.setState({
      comment,
      buttonMoreVisible: false,
    });
  }

  reportContent = () => {
    const { status } = this.props;
    const content = [];
    for (let i = 2; i < this.displayNames.length; i += 1) {
      const displayName = this.displayNames[i];
      const fieldName = this.fieldNames[i];
      const cellValue = fieldName === 'surveyors' ? this.surveyors() : (
        <span>{this.props.reportValues[fieldName]}</span>
      );
      content[i] = (
        <Col span={12} key={i.toString()} className="content-cell">
          <span className="display-name">{displayName}</span>
          {cellValue}
        </Col>
      );
    }
    if (this.reportBigData && status !== 1) {
      let buttonMore = null;
      if (this.state.buttonMoreVisible) {
        buttonMore = (
          <Button onClick={this.displayCommentAll} className="button-more">查看更多</Button>
        );
      }
      content[content.length] = (
        <div key="comment" className="content-cell comment">
          <span className="display-name">审核意见</span>
          <span>{this.state.comment}</span>
          {buttonMore}
        </div>
      );
    }
    return content;
  }

  buttonJump = () => {
    const {
      buttonStyle,
      entId,
      status,
      reportId,
      applyId,
    } = this.props;
    const urlPart = this.reportBigData ?
      `?applyId=${applyId}&censorId=${reportId}` : `/${applyId}`;
    const path = this.reportBigData ? 'BigDataCreditReport' : 'OnsiteSurvey';
    let text = this.reportBigData ? '查看完整报告' : '查看资料';
    const key = this.reportBigData ? 'censorId' : 'surveyId';
    let to = {
      pathname:`/Manage/${path}${urlPart}`,
      state: {
        applyId,
        detail: true,
        entId,
        [key]: reportId,
      },
    };
    if (this.reportBigData && status !== 1) {
      to = `/Manage/BigDataCreditReport${urlPart}#detail`;
    }
    if (status === undefined || status === 1) {
      text = '完善资料';
      to.state.detail = false;
      if (this.reportBigData) {
        text = '点击查询企业征信';
        to = `/Manage/BigDataCreditReport${urlPart}`;
      }
    }
    return (
      <Link
        to={to}
        className="button-open-report"
        style={buttonStyle}
      >
        {text}
      </Link>
    );
  }

  render() {
    const { reportTitle, status } = this.props;

    return (
      <div className="credit-report">
        <span className="credit-cell-title">{reportTitle}</span>
        <div className="report-wrapper">
          {this.reportSideTitle()}
          <Form id="id-div-report-content">
            <Row gutter={24}>{this.reportContent()}</Row>
          </Form>
          <img alt="" className="image-status" src={imagePath()[status]} />
          {this.buttonJump()}
        </div>
      </div>
    );
  }
}
