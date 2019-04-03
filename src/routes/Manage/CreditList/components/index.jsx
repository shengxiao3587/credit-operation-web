import React from 'react';
import { Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields, formatMoney } from '../../../../util';

class View extends React.Component {
  componentDidMount() {
    this.props.dict('fundStatus');
    this.load();
  }

  getStatusData = () => this.props.dicts.fundStatus;

  refresh = () => {
    this.load();
  };

  load = () => {
    this.props.loadCreditList({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };
  freezeConfirm = (record, isFreeze) => {
    this.props.freeze({
      linesId: record.linesId,
      freezeFlag: isFreeze,
      entId: record.entId,
    }).then((s) => {
      s && this.load();
    });
  };

  columnAction = (text, record) => {
    let freeze;
    if (record.fundStatus === 1) {
      freeze = (
        <Popconfirm
          title="确定要冻结吗?"
          onConfirm={() => this.freezeConfirm(record, true)}
        >
          <a type="primary">冻结</a>
        </Popconfirm>
      );
    } else if (record.fundStatus === 2) {
      freeze = (
        <Popconfirm
          title="确定要解冻吗?"
          onConfirm={() => this.freezeConfirm(record, false)}
        >
          <a type="primary">解冻</a>
        </Popconfirm>
      );
    } else {
      freeze = (
        <a disabled type="primary">解冻</a>
      );
    }
    return (
      <React.Fragment>
        {this.props.permission.freeze && freeze}
        {this.props.permission.detail &&
        <Link
          to={{
            pathname: `/Manage/CreditDetail/${record.bizNo}`,
            state:{ linesId:record.linesId, entId:record.entId },
          }}
        >
          明细
        </Link>}
      </React.Fragment>
    );
  };

  renderStatus = (text, record) => {
    const { fundStatus } = record;
    const colorMapper = {
      1: '#40BF26',
      2: '#F5222D',
      3: '#62666C',
    };
    return (
      <span
        style={{
          color: colorMapper[fundStatus],
        }}
      >
        {text}
      </span>
    );
  };

  renderLines = (text) => formatMoney(text, 100, 2);

  render() {
    const {
      columns,
      data,
      loading,
      page,
      loadCreditList,
      searchParams,
      changeSearch,
      topButtons,
    } = this.props;
    return (
      <ListPage
        rowKey="bizNo"
        columns={parseFields.call(this, columns)}
        title="额度管理"
        data={data}
        loading={loading}
        page={page}
        search={loadCreditList}
        searchParams={searchParams}
        changeSearch={changeSearch}
        topButtons={parseFields.call(this, topButtons)}
        searchButtonSpan={2}
      />
    );
  }
}

export default View;
