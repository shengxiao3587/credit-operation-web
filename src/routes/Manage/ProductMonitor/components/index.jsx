import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields, formatMoney } from '../../../../util';

export default class ProductMonitor extends Component {
  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  refresh = () => {
    this.load();
  };

  load = () => {
    this.props.fetchStoreRecords({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };

  renderOperation = (text, record) => (
    this.props.permission.list &&
    <Link
      to={{ pathname:'/Manage/CategoryDetail', state:{ bankId:record.bankId, businessId:record.businessId } }}
    >
      明细
    </Link>
  );

  renderAmount = (text) => formatMoney(text, 100, 2);

  render() {
    const {
      storeColumns,
      storeRecords,
      loading,
      page,
      topButtons,
      fetchStoreRecords,
      searchParams,
      changeSearchParams,
    } = this.props;
    return (
      <ListPage
        rowKey="rowKey"
        title="进口商品列表"
        topButtons={parseFields.call(this, topButtons)}
        columns={parseFields.call(this, storeColumns)}
        data={storeRecords}
        loading={loading}
        page={page}
        search={fetchStoreRecords}
        changeSearch={changeSearchParams}
        searchParams={searchParams}
      />
    );
  }
}
