import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { formatMoney, parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.page,
    });
  }

  statusMapper = {
    1: '待审核',
    2: '审核通过',
    3: '驳回',
  };

  renderAction = (text, record) => {
    return (
      <React.Fragment>
        { this.props.permission.check && (
          <Link
            to={`/Manage/RepayAuditDetail/${record.applyNo}#check`}
            className={'23'.includes(record.status) ? 'table-button-disabled' : ''}
          >
            审核
          </Link>
        )}
        { this.props.permission.detail && (
          <Link to={`/Manage/RepayAuditDetail/${record.applyNo}#detail`}>明细</Link>
        ) }
      </React.Fragment>
    );
  };

  renderAmount = (text) => {
    return formatMoney(text, 100, 2);
  };

  renderStatus = (text) => {
    const colorMapper = {
      1: '#62666C',
      2: '#40BF26',
      3: '#F5222D',
    };
    const style = {
      color: colorMapper[text],
    };
    return (<span style={style}>{this.statusMapper[text]}</span>);
  };

  render() {
    const {
      data,
      loading,
      page,
      load,
      changeSearch,
      searchParams,
      columns,
    } = this.props;

    return (
      <ListPage
        rowKey="applyNo"
        title="还款复核"
        columns={parseFields.call(this, columns)}
        data={data}
        loading={loading}
        page={page}
        search={load}
        changeSearch={changeSearch}
        searchParams={searchParams}
        xScroll={800}
        searchButtonSpan={2}
      />
    );
  }
}

export default View;
