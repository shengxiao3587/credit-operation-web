import React, { Component } from 'react';
import { ModalForm } from '@f12/components';
import { Icon, Tag } from 'antd';
import moment from 'moment';
import DetailPage from '../../../../components/DetailPage';
import { formatMoney, parseFields } from '../../../../util';
import './index.scss';

export default class View extends Component {
  componentDidMount() {
    this.load();
    this.props.getLimit({
      withdrawId: this.props.match.params.id,
    });
  }

  componentWillUnmount() {
    this.props.reset();
  }

  load = () => {
    this.props.detail({
      withdrawId: this.props.match.params.id,
    }).then((success) => {
      if (success) {
        this.props.getOverdue({
          withdrawId: this.props.match.params.id,
          actualRepayTime: moment(this.props.record.actualRepayTime.value).valueOf(),
          principalAmount: success.data.principal,
        });
      }
    });
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  check = (form) => {
    form.validateFieldsAndScroll({ force: true }, (err) => {
      if (!err) {
        this.props.showModal();
      }
    });
  };

  changeDate = (date) => {
    const {
      repayTime = {},
    } = this.props.record;
    if (!date) {
      this.props.changeDate(0);
    } else {
      this.props.changeDate(moment(`${date} 23:59:59`).diff(repayTime.value, 'days'));
      this.props.getOverdue({
        withdrawId: this.props.match.params.id,
        actualRepayTime: moment(date).valueOf(),
        principalAmount: this.props.record.principal.value,
      });
    }
  };

  renderRepayReal = () => {
    const {
      principal = {},
      borrowAmount = {},
    } = this.props.record;
    return (
      <span style={{ color: 'red', whiteSpace: 'nowrap' }}>
        本金：{formatMoney(principal.value, 100, 2)}
        &nbsp;&nbsp;利息：{formatMoney(borrowAmount.value, 100, 2)}
      </span>);
  };

  renderDisabledDate = (value) => {
    const {
      auditTime = {},
    } = this.props.record;
    if (!value) {
      return false;
    }
    return value.format('YYYY-MM-DD') < moment(auditTime.value).format('YYYY-MM-DD');
  };

  renderOverdue = () => {
    return this.props.days > 0 ? (
      <Tag
        color="#f50"
        style={{
          position: 'absolute',
          right: -80,
          top: 8,
        }}
      >
        逾期{this.props.days}天
      </Tag>
    ) : null;
  };

  renderOverdueAmount = () => {
    return formatMoney(this.props.overdueData, 100, 2);
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
      changeRecord,
      changeModalRecord,
      modalRecord,
      modalLoading,
    } = this.props;
    return (
      <div className="repay-container">
        <DetailPage
          // layout="inline"
          loading={loading}
          values={record}
          topTitle="还款"
          changeRecord={changeRecord}
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            colSpan: field.colSpan || 12,
          })))}
          buttons={parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
        />
        <ModalForm
          visible={modalVisible}
          cusTitle="确认还款"
          okText="确认还款"
          cancelText="取消"
          onCreate={() => {
            this.props.save({
              principalAmount: record.principal.value,
              actualRepayTime: moment(record.actualRepayTime.value).valueOf(),
              comment: record.comment.value,
              withdrawId: this.props.match.params.id,
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
          formClassName="repay-form"
        >
          <div className="repay-warning"><Icon type="info-circle-o" /> 请确保已将还款金额转账至指定银行账户</div>
        </ModalForm>
      </div>
    );
  }
}
