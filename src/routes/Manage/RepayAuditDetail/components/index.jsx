import React, { Component } from 'react';
import { ModalForm } from '@f12/components';
import { Tag } from 'antd';
import moment from 'moment';
import DetailPage from '../../../../components/DetailPage';
import { formatMoney, parseFields } from '../../../../util';
import './index.scss';

export default class View extends Component {
  componentDidMount() {
    this.isEdit = window.location.hash.slice(1) === 'check';
    this.load();
  }

  load = () => {
    this.props.detail({
      applyNo: this.props.match.params.id,
    });
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  check = () => {
    this.props.showModal();
  };

  renderCommentHidden = () => {
    return this.props.modalRecord.status.value === '2';
  };

  renderRepayReal = () => {
    const {
      principalAmount = {},
      interestAmount = {},
    } = this.props.record;
    return (
      <span style={{ color: 'red', whiteSpace: 'nowrap' }}>
        本金：{formatMoney(principalAmount.value, 100, 2)}
        &nbsp;&nbsp;利息：{formatMoney(interestAmount.value, 100, 2)}
      </span>);
  };

  renderRepay = () => {
    const {
      principalAmount = {},
      interestAmount = {},
      overdueAmount = {},
    } = this.props.record;
    return (
      <span style={{ color: 'red', whiteSpace: 'nowrap' }}>
        本金：{formatMoney(principalAmount.value, 100, 2)}
        &nbsp;&nbsp;利息：{formatMoney(interestAmount.value, 100, 2)}
        &nbsp;&nbsp;逾期：{formatMoney(overdueAmount.value, 100, 2)}
      </span>);
  };

  renderRepayFlag = (value) => {
    return value ? '是' : '否';
  };

  renderCheckHidden = () => {
    return this.props.record.auditRecord.value.length === 0;
  };

  renderTableData = () => {
    return this.props.record.auditRecord.value;
  };

  renderButtonHidden = () => {
    return !this.isEdit;
  };

  renderOverdue = () => {
    const {
      actualRepayTime = {},
      repayTime = {},
    } = this.props.record;
    const days = moment(actualRepayTime.value).diff(moment(repayTime.value), 'days');
    return days > 0 ? (
      <Tag
        color="#f50"
        style={{
          position: 'absolute',
          left: 80,
          top: 0,
        }}
      >
        逾期{days}天
      </Tag>
    ) : null;
  };

  render() {
    const {
      record,
      fields,
      buttons,
      topButtons,
      loading,
      modalVisible,
      cancelModal,
      modalFields,
      changeModalRecord,
      modalRecord,
      modalLoading,
    } = this.props;
    return (
      <div className="repaydetail-container">
        <DetailPage
          layout="inline"
          loading={loading}
          values={record}
          topTitle="还款审核"
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            required: true,
            colSpan: field.colSpan || 12,
            disabled: true,
            containerClassName: field.containerClassName || 'repaydetail-field',
          })))}
          buttons={parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
        />
        <ModalForm
          visible={modalVisible}
          cusTitle="审核"
          okText="确定"
          cancelText="取消"
          onCreate={(values) => {
            this.props.check({
              ...values,
              applyNo: this.props.match.params.id,
            }).then((success) => {
              if (success) {
                this.props.history.goBack();
              }
            });
          }}
          onCancel={cancelModal}
          formWidth={450}
          fields={parseFields.call(this, modalFields)}
          changeRecord={changeModalRecord}
          values={modalRecord}
          confirmLoading={modalLoading}
        />
      </div>
    );
  }
}
