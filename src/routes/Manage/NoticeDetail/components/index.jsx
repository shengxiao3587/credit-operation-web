/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { Button } from 'antd';
import { DetailPage } from '@f12/components';
import { parseFields } from '../../../../util';
import './style.scss';

class View extends Component {
  componentDidMount() {
    this.props.dict('noticeType');
    this.load();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  getNoticeTypeData = () => this.props.dicts.noticeType;

  load() {
    const { id } = this.props.match.params;
    if (id !== 'new') {
      this.props.load({
        noticeId: id,
      });
    }
  }

  submit = (form) => {
    // force is important, as default the value not change won't validate the rules
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        this.props.save(values).then((success) => {
          if (success) {
            this.props.history.goBack();
          }
        });
      }
    });
  };

  back = () => {
    this.props.history.goBack();
  };

  isShow = () => {
    const mode = this.props.location.state ? this.props.location.state.mode : 'view';
    return mode === 'view';
  };

  shapValue = (params) => {
    if (params === undefined || typeof params === 'string') {
      return params;
    }
    return params.value;
  };

  renderDetail = () => (
    <div>
      <div className="notice-title">
        {this.shapValue(this.props.record.title)}
      </div>
      <div className="notice-subhead">
        <div>发布时间：{this.shapValue(this.props.record.createTime)}</div>
        <div>类别：{this.shapValue(this.props.record.noticeTypeName)}</div>
        <div>操作人：{this.shapValue(this.props.record.operator)}</div>
      </div>
      <div className="notice-content ql-editor">
        <div dangerouslySetInnerHTML={{ __html: this.shapValue(this.props.record.content) }} />
      </div>
      <div className="notice-button">
        <Button onClick={this.back} type="primary">关闭</Button>
      </div>
    </div>
  );

  render() {
    const {
      record,
      changeRecord,
      breadcrumb,
      fields,
      buttons,
      topButtons,
    } = this.props;
    let title = '';
    const mode = this.props.location.state ? this.props.location.state.mode : 'view';
    if (mode === 'view') {
      title = '详情';
    } else if (this.props.match.params.id === 'new') {
      title = '新增';
    } else {
      title = '编辑';
    }
    let children = '';
    if (mode === 'view') {
      children = this.renderDetail();
    }
    return (
      <div className="notice-detail-container">
        <DetailPage
          values={record}
          changeRecord={changeRecord}
          breadcrumb={breadcrumb}
          fields={parseFields.call(this, fields)}
          buttons={parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
          topTitle={title}
        >
          {children}
        </DetailPage>
      </div>
    );
  }
}

export default View;
