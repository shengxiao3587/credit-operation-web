import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import { Table, ImagePreview, ImagePicker } from '@f12/components';
import moment from 'moment';
import DetailPage from '../../../../components/DetailPage';
import { parseFields } from '../../../../util';
import './index.scss';

const colorMapper = {
  待审核: '#62666C',
  审核通过: '#40BF26',
  驳回: '#F5222D',
};

class View extends Component {
  componentDidMount() {
    this.load();
  }
  componentWillUnmount() {
    this.props.reset();
  }

  getPlaceholder = () => {
    const value = this.props.auditRecord.status.value
      ? this.props.auditRecord.status.value : this.props.auditRecord.status;
    if (value === '2' || value === 2) {
      return '请输入备注';
    }
    return '请简要填写驳回原因';
  };

  getRequired = () => {
    const value = this.props.auditRecord.status.value
      ? this.props.auditRecord.status.value : this.props.auditRecord.status;
    return value === '3' || value === 3;
  };

  load() {
    const { id } = this.props.match.params;
    this.props.load({
      withdrawApplyId: id,
    });
  }


  previewImg = (value, index, name) => {
    this.props.previewImg(true, value, index, name);
  };


  refresh = () => {
    this.load();
  };

  isHidden = () => {
    const value = this.props.auditRecord.status.value
      ? this.props.auditRecord.status.value : this.props.auditRecord.status;
    return value === '3' || value === 3;
  };

  submit = (form) => {
    // force is important, as default the value not change won't validate the rules
    const withdrawApplyId = this.props.match.params.id;
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        this.props.audit({ ...values, withdrawApplyId }).then((success) => {
          if (success) {
            this.props.history.goBack();
          } else {
            this.load();
          }
        });
      }
    });
  };

  disabledDate = (current) => {
    return current && current < moment().subtract(1, 'days').endOf('day');
  };

  back = () => {
    this.props.history.goBack();
  };

  auditAmountMax = () => {
    if (this.props.record.useCreditLines) {
      return this.props.record.useCreditLines - 0;
    }
    return 0;
  };

  returnDetailPage = (record) => {
    const {
      withdrawNoticeUrl,
      cmclInvoiceUrl,
    } = record;
    return (
      <div className="wcd-wrap">
        <Spin spinning={this.props.loading}>
          <div className="wcd-title">
            <div className="wcd-titleName">审批</div>
            <div className="wcd-topButtons">
              <Button icon="sync" onClick={this.refresh}>刷新</Button>
              <Button icon="rollback" onClick={this.back}>返回</Button>
            </div>
          </div>
          <div className="wcd-smallTitle">提款信息</div>
          <div className="ant-row wcd-row">
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
                <div className="ant-col-12 wcd-col" key={item.name}>
                  <span className="wcd-label">{item.label} : </span>{recordValue}
                </div>
              );
            })}
          </div>
          <div className="wcd-lastCol">
            <span className="wcd-label"> 预计到期应还款（港币）: </span>
            <span style={{ padding: '0 5px', color: '#62666C' }}>本金</span>
            <span style={{ color:'#F5222D' }}>{record.principal}</span>
            <span style={{ padding: '0 5px', color: '#62666C' }}>利息</span>
            <span style={{ color:'#F5222D' }}>{record.borrowAmount}</span>
          </div>
          <div className="wcd-photo">
            <div className="wcd-photo-title">证明材料</div>
            <div
              className="wcd-photo-wrap"
              style={{ paddingRight:'16px' }}
              role="presentation"
            >
              <ImagePicker
                alt=""
                value={withdrawNoticeUrl}
                type="file"
                width={80}
                height={80}
                getUrl={() => {}}
                disabled
                tokenSeparators=","
                onPreview={() => {
                  this.previewImg([withdrawNoticeUrl, cmclInvoiceUrl], 0, withdrawNoticeUrl);
                }}
              />
              <div className="wcd-photo-label">提款通知书</div>
            </div>
            <div
              className="wcd-photo-wrap"
              role="presentation"
            >
              <ImagePicker
                alt=""
                value={cmclInvoiceUrl}
                type="file"
                width={80}
                height={80}
                getUrl={() => {}}
                disabled
                tokenSeparators=","
                onPreview={() => {
                  this.previewImg([withdrawNoticeUrl, cmclInvoiceUrl], 1, cmclInvoiceUrl);
                }}
              />
              <div className="wcd-photo-label">商业发票</div>
            </div>
          </div>
        </Spin>
      </div>
    );
  };

  renderResult = (text) => (<span style={{ color:colorMapper[text] }}>{text}</span>);

  render() {
    const {
      record,
      list,
      columns,
      buttons,
      auditFields,
      auditRecord,
      changeRecord,
      imgVisible,
      imgIndex,
      previewImg,
      currentImgs,
    } = this.props;
    const mode = this.props.location.state ? this.props.location.state.mode : 'view';
    return (
      <div style={{ width: '100%' }}>
        {this.returnDetailPage(record)}
        {mode === 'view' && (
          <React.Fragment>
            {record.statusName !== '待审核' &&
            <div className="wcd-table" style={{ margin:'16px', background:'#fff', padding:'16px 35px' }}>
              <div className="wcd-table-title">审批记录</div>
              <Table
                columns={parseFields.call(this, columns)}
                dataSource={list}
                rowKey="auditTime"
                xScroll={800}
              />
            </div>}
            <Button
              type="primary"
              onClick={this.back}
              style={{ marginLeft:'50px' }}
            >关闭
            </Button>
          </React.Fragment>
        )}
        {mode === 'audit' && (
          <DetailPage
            buttons={parseFields.call(this, buttons)}
            fields={parseFields.call(this, auditFields)}
            title="提款审核建议"
            values={auditRecord}
            changeRecord={changeRecord}
          />
        )}
        <ImagePreview
          visible={imgVisible}
          images={currentImgs}
          hide={() => {
            previewImg(false, currentImgs, imgIndex);
          }}
          index={imgIndex}
        />
      </div>
    );
  }
}

export default View;
