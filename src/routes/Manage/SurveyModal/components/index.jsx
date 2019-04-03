import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import { ModalForm, Table } from '@f12/components';
import Header from '../../../../../src/components/Header/Header';
import { parseFields } from '../../../../util';
import './style.scss';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  load() {
    const { loadSurveyModals, searchParams, page } = this.props;
    loadSurveyModals({
      ...searchParams,
      ...page,
      prodId: this.props.match.params.id,
    });
  }

  refresh = () => {
    this.load();
  };

  renderAction = (text, record) => {
    return (this.props.location.hash.slice(1) === 'edit' &&
      <div>
        <a
          tabIndex={-1}
          role="button"
          id="id-button-edit"
          onClick={() => {
            this.props.modalOpen(record);
          }}
        >
          编辑
        </a>
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            this.props.deleteItem({
              id: record.id,
            }).then((success) => {
              if (success) {
                this.load();
              }
            });
          }}
        >
          <a type="default">删除</a>
        </Popconfirm>
      </div>
    );
  };

  render() {
    const {
      columnData,
      loading,
      columns,
      topButtons,
      modalVisible,
      modalOpen,
      modalClose,
      edit,
      page,
      changeRecord,
      recordData,
      loadSurveyModals,
    } = this.props;
    const callbacks = {
      modalOpen: modalOpen.bind(this, {}),
      refresh: this.refresh.bind(this),
    };
    let buttonsUsage = [
      'new',
    ];
    if (this.props.location.hash.slice(1) === 'detail') {
      buttonsUsage = [
        'refresh',
      ];
    }

    return (
      <div id="id-div-survey-modal">
        <Header
          title="尽调模型"
          buttonsUsage={buttonsUsage}
          callbacks={callbacks}
        />
        <Table
          rowKey="id"
          columns={parseFields.call(this, columns)}
          dataSource={columnData}
          loading={loading}
          topButtons={parseFields.call(this, topButtons)}
          noSearch
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            ...page,
          }}
          search={(params) => {
            loadSurveyModals({
              ...params,
              prodId: this.props.match.params.id,
            });
          }}
        />
        <ModalForm
          visible={modalVisible}
          cusTitle="编辑"
          okText="确定"
          cancelText="取消"
          onCreate={(values) => {
            edit({ ...values, prodId: this.props.match.params.id }).then((success) => {
              if (success) {
                this.load();
              }
            });
          }}
          onCancel={modalClose}
          formWidth={450}
          fields={[{
            label: '标题名称',
            name: 'name',
            max: 100,
            required: true,
          }, {
            label: '类型',
            name: 'type',
            type: 'select',
            valueName: 'value',
            displayName: 'label',
            data: [{
              label: '附件',
              value: '1',
            }],
            value: '1',
            required: true,
          }]}
          changeRecord={changeRecord}
          values={recordData}
        />
      </div>
    );
  }
}

export default View;
