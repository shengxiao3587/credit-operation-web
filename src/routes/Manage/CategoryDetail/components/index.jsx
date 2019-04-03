import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

export default class CategoryDetail extends Component {
  componentDidMount() {
    const state = this.props.location.state ? this.props.location.state : { bankId:'', businessId:'' };
    this.props.changeSearchParams({ ...state });
    this.props.fetchCategoryRecords({
      ...state,
      ...this.props.page,
    });
  }

  componentWillUnmount() {
    this.props.reset();
  }

  load = () => {
    this.props.fetchCategoryRecords({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  renderOperation = (text, record) => (
    <Link
      to={{ pathname:'/Manage/CheckOrder', state:{ goodsNo:record.goodsNo } }}
    >
    出库明细
    </Link>
  );

  render() {
    const {
      categoryColumns,
      categoryRecords,
      loading,
      page,
      topButtons,
      fetchCategoryRecords,
      searchParams,
      changeSearchParams,
    } = this.props;
    return (
      <ListPage
        title="入库明细"
        rowKey="rowKey"
        topButtons={parseFields.call(this, topButtons)}
        columns={parseFields.call(this, categoryColumns)}
        data={categoryRecords}
        loading={loading}
        page={page}
        search={fetchCategoryRecords}
        searchParams={searchParams}
        changeSearch={changeSearchParams}
        searchButtonSpan={2}
      />
    );
  }
}
