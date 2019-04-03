import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { ImagePreview } from '@f12/components';
import Header from '../../../../../src/components/Header/Header';
import './index.scss';
import MaterialClientSubmits from './MaterialClientSubmits';
import CreditReport from './CreditReport';
import ExamineAdviceForm from './ExamineAdvice';
import BoxStartExamine from './BoxStartExamine';
import './material.scss';

// 授信审核
class CreditAssessment extends Component {
  constructor(props) {
    super(props);
    this.detailMode = this.props.location.hash === '#detail';
    const { creditCensor, sceneSurvey } = this.props;
    this.state = {
      creditCensor,
      sceneSurvey,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    const { creditCensor, sceneSurvey } = nextProps;
    this.setState({
      creditCensor,
      sceneSurvey,
    });
  }

  refresh = () => {
    this.load();
  }

  examineAdviceContent = () => {
    const {
      examine,
      submit,
      data,
      examineAdviceColumns,
      examineAdviceContent,
      history,
      clonedExamine,
    } = this.props;
    const examineRecord = (
      <div className="material">
        <span className="advice-title">审批记录</span>
        <Table
          columns={examineAdviceColumns}
          dataSource={examineAdviceContent}
          scroll={{ x: 800 }}
        />
      </div>
    );
    const contentMapper = {
      1: (
        <ExamineAdviceForm
          defaultData={examine}
          submit={submit}
          history={history}
          clonedDefaultData={clonedExamine}
        />
      ),
      2: examineRecord,
      3: examineRecord,
    };
    return contentMapper[data.status];
  }

  load = () => {
    this.props.loadCreditDetail({
      applyId: this.props.match.params.id,
    });
  }

  back = () => {
    this.props.history.goBack();
  }

  reportArea = (params) => {
    const { data, history } = this.props;
    const { applyId, entId } = data;
    const p = params;
    const { status } = p.content;
    const reportBigData = p.title === '大数据征信报告';
    const reportId = reportBigData ? p.content.censorId : p.content.surveyId;
    let area = (
      <CreditReport
        reportValues={p.content}
        reportTitle={p.title}
        fields={p.fields}
        buttonStyle={p.buttonStyle}
        applyId={applyId}
        reportId={reportId}
        status={status}
        entId={entId}
        history={history}
      />
    );
    if (!this.detailMode && status === undefined) {
      area = (
        <BoxStartExamine
          reportTitle={p.title}
          buttonText={p.buttonText}
          tip={p.tip}
          history={history}
          applyId={applyId}
          reportId={reportId}
          entId={entId}
        />
      );
    } else if (this.detailMode && status === undefined) {
      area = null;
    }
    return area;
  }

  render() {
    const {
      loanUsages,
      loanUsagesColumns,
      entData,
      entDataColumns,
      evidence,
      bigDataCreditColumns,
      sceneSurveyColumns,
      data,
      preview,
      imgVisible,
      currentImgs,
      imgIndex,
    } = this.props;
    const callbacks = {
      refresh: this.refresh.bind(this),
      back: this.back.bind(this),
    };
    const sceneReportParams = {
      content: this.state.sceneSurvey,
      title: '现场尽职调查',
      fields: sceneSurveyColumns,
      buttonStyle: {
        background: '#3167CA',
        width: '104px',
        bottom: '20px',
      },
      buttonText: '发起现场尽调',
      tip: '还未对该企业进行现场尽职调查',
    };
    const bidDataParams = {
      content: this.state.creditCensor,
      title: '大数据征信报告',
      fields: bigDataCreditColumns,
      buttonStyle: {
        background: '#E6B981',
        width: '132px',
        bottom: '26px',
      },
      buttonText: '点击查询企业征信',
      tip: '查询企业征信之前，请先仔细核对商家资质',
    };
    let examineAdviceContent = this.examineAdviceContent();
    if (data.status === 1 && this.detailMode) {
      examineAdviceContent = null;
    }
    const buttonClose = this.detailMode ? (
      <Button
        type="primary"
        onClick={() => { this.back(); }}
        className="button-close"
      >
        关闭
      </Button>
    ) : null;
    return (
      <div className="assessment-main">
        <ImagePreview
          visible={imgVisible}
          images={currentImgs}
          hide={() => {
            preview(false, currentImgs, imgIndex);
          }}
          index={imgIndex}
        />
        <div id="id-div-assessment">
          <Header
            title={this.detailMode ? '明细' : '审核'}
            buttonsUsage={[
              'refresh',
              'back',
            ]}
            callbacks={callbacks}
          />
          <div id="id-div-assessment-wrapper">
            <MaterialClientSubmits
              loanUsagesColumns={loanUsagesColumns}
              entDataColumns={entDataColumns}
              loanUsages={loanUsages}
              entData={entData}
              urls={evidence}
              preview={preview}
            />
            {this.reportArea(bidDataParams)}
            {this.reportArea(sceneReportParams)}
            <br />
          </div>
          <div id="id-div-advice-wrapper">
            {examineAdviceContent}
          </div>
        </div>
        {buttonClose}
      </div>
    );
  }
}

export default CreditAssessment;
