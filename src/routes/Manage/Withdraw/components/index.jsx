import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DateUtil } from '@xinguang/common-tool';
import { ModalForm } from '@f12/components';
import { Popover, Icon } from 'antd';
import ListPage from '../../../../components/ListPage';
import { parseFields, formatMoney } from '../../../../util';

const buttonColorMap = {
  正常: '#2973FF',
  关注: '#FFB900',
  次级: '#FF6432',
  可疑: '#DC1E00',
};

const content = {
  0: '最近七日的日均销售量',
  1: '最近七日的日均销售额',
  2: '截止当前进口商品的销售进度',
  3: '截止到期还款日，预计商品完成的销售额',
  4: '预计贷款回收率（R）=预计销售额/提款本息*100%，预测截止到期还款日商家收回贷款的完成率',
  5: '依据预计贷款回收率(R)预测风险',
};

export default class Withdraw extends Component {
  componentDidMount() {
    this.props.dict('withdrawStatus');
    this.load();
  }

  getStatusData = () => this.props.dicts.withdrawStatus;

  load = () => {
    this.props.fetchWithdrawRecords({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };

  refresh = () => {
    this.load();
  };

  returnText = (text, index) => (
    <div>
      {text}
      <Popover trigger="hover" content={content[index]} placement="right">
        <Icon style={{ paddingLeft: '10px' }} type="question-circle" />
      </Popover>
    </div>
  );

  renderOperation = (text, record) => {
    const riskButton = (
      <a
        role="presentation"
        onClick={() => { this.props.modalOpen(record); }}
        style={{ color:buttonColorMap[record.profileRisk] }}
      >
        {record.profileRisk}
      </a>
    );
    return (
      <React.Fragment>
        {this.props.permission.repay && (
          <Link
            to={`/Manage/RepayDetail/${record.withdrawId}`}
            className={'3'.includes(record.status) ? 'table-button-disabled' : ''}
          >
            还款
          </Link>
        )}
        {this.props.permission.detail && <Link to={`/Manage/WithdrawDetail/${record.withdrawId}`}>明细</Link>}
        {this.props.permission.risk && riskButton}
      </React.Fragment>
    );
  };

  renderCreateTimeShow = (text, record) => (record.createTime ? DateUtil.formatDate(record.createTime) : '-');

  renderWithdrawAmount = (text) => formatMoney(text, 100, 2);

  renderRepayTime = (text) => DateUtil.formatDate(text, 'yyyy-MM-dd');

  renderAvgSaleNum = (text) => this.returnText(text, 0);

  renderAvgSaleAmount = (text) => this.returnText(text, 1);

  renderSaleProgress = (text) => this.returnText(text, 2);

  renderEstimateSales = (text) => this.returnText(text, 3);

  renderRecoveryRate = (text) => this.returnText(text, 4);

  renderProfileRisk = (text) => this.returnText(text, 5);

  render() {
    const {
      withdrawColumns,
      widthdrawRecords,
      loading,
      page,
      topButtons,
      fetchWithdrawRecords,
      searchParams,
      changeSearchParams,
      modalRecord,
      modalVisible,
      modalClose,
      fields,
    } = this.props;
    return (
      <div style={{ width:'100%' }}>
        <ListPage
          rowKey="withdrawId"
          title="提款列表"
          columns={parseFields.call(this, withdrawColumns)}
          data={widthdrawRecords}
          loading={loading}
          page={page}
          topButtons={parseFields.call(this, topButtons)}
          search={fetchWithdrawRecords}
          changeSearch={changeSearchParams}
          searchParams={searchParams}
          searchButtonSpan={2}
        />
        <ModalForm
          cusTitle=" "
          buttons={[{
            label: '关闭',
            onClick: () => { this.props.modalClose(); },
          }]}
          values={modalRecord}
          visible={modalVisible}
          onCancel={modalClose}
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            disabled:true,
          })))}
        />
      </div>
    );
  }
}
