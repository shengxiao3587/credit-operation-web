import React, { Component } from 'react';
import { ModalForm } from '@f12/components';
import { Button } from 'antd';
import ListPage from '../../../../components/ListPage';
import { parseFields, formatMoney } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  load = () => {
    this.props.load({
      ...this.props.page,
      ...this.props.searchParams,
    });
  };

  refresh = () => {
    this.load();
  };

  buttonClick = (record) => {
    this.props.modalOpen(record.id);
    const { businessId } = record;
    this.props.loadWithdraw({ businessId });
  };

  renderOperation = (text, record) => (
    <Button type="primary" onClick={this.buttonClick.bind(this, record)}>关联提款记录</Button>
  );

  renderPrice = (text) => formatMoney(text, 100, 2);

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
      withdrawlRecords,
      recordData,
      changeRecord,
    } = this.props;

    return (
      <div className="wait-match-list" style={{ width: '100%' }}>
        <ListPage
          rowKey="id"
          title="未匹配列表"
          columns={parseFields.call(this, columns)}
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
          cusTitle="关联提款记录"
          okText="确定"
          cancelText="取消"
          onCreate={() => {
            this.props.relateWithdraw({ ...this.props.relateData }).then((s) => {
              s && this.load();
            });
          }}
          onCancel={modalClose}
          fields={[{
            label: '关联提款记录',
            name: 'id',
            type: 'select',
            required: true,
            data: withdrawlRecords,
          }]}
          changeRecord={changeRecord}
          values={recordData}
        />
      </div>
    );
  }
}

export default View;
