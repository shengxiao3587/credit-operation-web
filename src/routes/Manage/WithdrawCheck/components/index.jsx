import React from 'react';
import { Link } from 'react-router-dom';
import { DateUtil } from '@xinguang/common-tool';
import ListPage from '../../../../components/ListPage';
import { parseFields, formatMoney } from '../../../../util';

const colorMapper = {
  待审核: '#62666C',
  审核通过: '#40BF26',
  驳回: '#F5222D',
};

class View extends React.Component {
  componentDidMount() {
    this.props.dict('auditStatus');
    this.load();
  }

  getStatusData = () => this.props.dicts.auditStatus;

  refresh = () => {
    this.load();
  };

  load = () => {
    this.props.loadWithdrawCheck({
      ...this.props.searchParams,
      ...this.props.page,
    });
  };

  columnAction = (text, record) => (
    <React.Fragment>
      {
        this.props.permission.check && (record.statusName === '待审核' ?
          <Link
            to={{ pathname:`/Manage/WithdrawCheckDetail/${record.withdrawApplyId}`, state: { mode:'audit' } }}
          >
            审核
          </Link> : <a disabled>审核</a>)
      }
      {
        this.props.permission.detail &&
        <Link
          to={{ pathname: `/Manage/WithdrawCheckDetail/${record.withdrawApplyId}`, state: { mode: 'view' } }}
        >
          明细
        </Link>
      }
    </React.Fragment>
  );

  renderCreateTimeShow = (text, record) => DateUtil.formatDate(record.createTime);

  renderBaseAmount = (text) => formatMoney(text, 100, 2);

  renderBorrowRate = (text) => `${(text * 100).toFixed(6)}%`;

  renderStatusName = (text) => (<span style={{ color:colorMapper[text] }}>{text}</span>);


  render() {
    const {
      columns,
      data,
      loading,
      page,
      loadWithdrawCheck,
      searchParams,
      changeSearch,
      topButtons,
    } = this.props;
    return (
      <ListPage
        rowKey="applyNo"
        columns={parseFields.call(this, columns)}
        title="提款审核"
        data={data}
        loading={loading}
        page={page}
        search={loadWithdrawCheck}
        searchParams={searchParams}
        changeSearch={changeSearch}
        topButtons={parseFields.call(this, topButtons)}
        searchButtonSpan={2}
      />
    );
  }
}

export default View;
