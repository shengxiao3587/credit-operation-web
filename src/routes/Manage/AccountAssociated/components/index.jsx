import React, { Component } from 'react';
import { ModalForm } from '@f12/components';
import { Button } from 'antd';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.load();
    this.props.dict('wmsAccountType');
    this.props.dict('business');
  }

  getPlatformData = () => this.props.dicts.wmsAccountType;

  load = () => {
    this.props.load({
      ...this.props.page,
      ...this.props.searchParams,
    });
  };

  topButtonClick = () => {
    this.props.topButtonClick();
  };

  editButtonClick = (record) => {
    this.props.editButtonClick(record);
  };


  viewButtonClick = (record) => {
    this.props.viewButtonClick(record);
  };

  renderOperation = (text, record) => (
    <React.Fragment>
      {this.props.permission.edit &&
      <Button type="primary" onClick={this.editButtonClick.bind(this, record)}>编辑</Button>}
      {this.props.permission.detail &&
      <Button type="primary" onClick={this.viewButtonClick.bind(this, record)}>明细</Button>}
    </React.Fragment>
  );


  render() {
    const {
      data,
      loading,
      page,
      load,
      changeSearch,
      searchParams,
      columns,
      modalVisible,
      modalClose,
      recordData,
      changeRecord,
      topButtons,
      modalStatus,
    } = this.props;

    const fields = [
      {
        label: '关联商家',
        name: 'businessId',
        disabled: modalStatus !== 'new',
        type: 'select',
        data: this.props.dicts.business,
      },
      {
        label: '所属平台',
        name: 'platformId',
        disabled: modalStatus !== 'new',
        type: 'select',
        data: this.props.dicts.wmsAccountType,
      },
      {
        label: '通行账号',
        name: 'wmsAccount',
        type: 'textarea',
        disabled: modalStatus === 'view',
      },
      {
        label: '添加时间',
        name: 'createTime',
        disabled: true,
        hidden: modalStatus !== 'view',
      },
      {
        label: '最近更新时间',
        name: 'updateTime',
        disabled: true,
        hidden: modalStatus !== 'view',
      },
      {
        label: '最近更新人',
        name: 'lastOpUser',
        disabled: true,
        hidden: modalStatus !== 'view',
      },
    ];

    return (
      <div className="wait-match-list" style={{ width: '100%' }}>
        <ListPage
          rowKey="id"
          title="wms账号关联"
          columns={parseFields.call(this, columns)}
          topButtons={parseFields.call(this, topButtons)}
          data={data}
          loading={loading}
          page={page}
          search={load}
          changeSearch={changeSearch}
          searchParams={searchParams}
          searchButtonSpan={2}
        />
        <ModalForm
          visible={modalVisible}
          cusTitle=" "
          okText="确定"
          cancelText="取消"
          onCreate={() => {
            this.props.relateWithdraw({ ...this.props.recordData }).then((s) => {
              s && this.load();
            });
          }}
          onCancel={modalClose}
          fields={fields}
          changeRecord={changeRecord}
          values={recordData}
        >
          {modalStatus !== 'view' && <div style={{ paddingLeft:'176px' }}>格式：#账号 #密码，例如 #guest#123456</div>}
        </ModalForm>
      </div>
    );
  }
}

export default View;
