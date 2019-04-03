import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields, formatMoney } from '../../../../util';

export default class CheckOrder extends Component {
  componentDidMount() {
    this.props.changeSearchParams({ ...this.props.location.state });
    this.props.fetchOrderRecords({
      ...this.props.location.state,
      ...this.props.page,
    });
  }

  componentWillUnmount() {
    this.props.reset();
  }

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  load = () => {
    this.props.fetchOrderRecords({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };

  renderOperation = (text, record) => (<Link to={`/Manage/ExpressDetail/${record.id}`}>查看物流</Link>);


  renderPrice = (text) => formatMoney(text, 100, 2);

  render() {
    const {
      orderColumns,
      orderRecords,
      loading,
      page,
      topButtons,
      fetchOrderRecords,
      searchParams,
      changeSearchParams,
    } = this.props;
    return (
      <ListPage
        title="出库明细"
        rowKey="rowKey"
        topButtons={parseFields.call(this, topButtons)}
        columns={parseFields.call(this, orderColumns)}
        data={orderRecords}
        loading={loading}
        page={page}
        search={fetchOrderRecords}
        searchParams={searchParams}
        changeSearch={changeSearchParams}
      />
    );
  }
}
