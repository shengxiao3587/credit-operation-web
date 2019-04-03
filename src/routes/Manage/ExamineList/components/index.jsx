import React, { Component } from 'react';
import { ListPage } from '@f12/components';
import { Link } from 'react-router-dom';
import { parseFields, formatMoney } from '../../../../util';

class View extends Component {
  constructor(props) {
    super(props);
    this.statusMapper = {
      1: '待审核',
      2: '审核通过',
      3: '驳回',
    };
  }

  componentDidMount() {
    this.load();
  }

  load = () => {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };

  refresh = () => {
    this.load();
  };

  renderPrice = (text) => formatMoney(text, 100, 2);

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

  renderAction = (text, record) => {
    const { status } = record;
    const invalidLinkstyle = {
      color: '#CACBCD',
      pointerEvents: 'none',
    };
    const examineStyle = '23'.includes(status) ? invalidLinkstyle : {};
    return (
      <React.Fragment>
        {this.props.permission.check &&
        <Link
          to={{
            pathname: `/Manage/CreditAssessment/${record.applyId}`,
            hash: 'examine',
          }}
          style={examineStyle}
        >审核
        </Link>}
        {this.props.permission.detail &&
        <Link
          to={{
            pathname: `/Manage/CreditAssessment/${record.applyId}`,
            hash: 'detail',
          }}
        >
          明细
        </Link>}
      </React.Fragment>
    );
  };
  render() {
    const {
      data,
      loading,
      page,
      load,
      changeSearch,
      searchParams,
      sorter,
      columns,
      buttons,
    } = this.props;

    return (
      <ListPage
        rowKey="applyNo"
        columns={parseFields.call(this, columns)}
        title="业务受理"
        data={data}
        loading={loading}
        page={page}
        search={load}
        changeSearch={changeSearch}
        searchParams={searchParams}
        sorter={sorter}
        buttons={parseFields.call(this, buttons)}
        hideReset
        searchButtonStyle={{ clear: 'none' }}
        xScroll={800}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        searchButtonSpan={2}
      />
    );
  }
}

export default View;
