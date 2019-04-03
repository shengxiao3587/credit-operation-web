import React, { Component } from 'react';
import { Popconfirm, Switch } from 'antd';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  clickAdd = () => {
    this.props.history.push({ pathname:'/Manage/NoticeDetail/new', state: { mode: 'edit' } });
  };
  load() {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.page,
    });
  }
  refresh = () => {
    this.load();
  };
  checkedChange = (record) => {
    if (record.status === true) {
      this.props.checkedChange({ noticeId:record.noticeId, noticeStatus:1 }).then((s) => {
        s && this.load();
      });
    } else {
      this.props.checkedChange({ noticeId:record.noticeId, noticeStatus:0 }).then((s) => {
        s && this.load();
      });
    }
  };
  deleteConfirm = (noticeId) => {
    this.props.deleteNotice({ noticeId }).then((success) => {
      success && this.load();
    });
  };

  renderStatus = (text, record) => (
    <Switch
      checked={record.status}
      checkedChildren="上架"
      unCheckedChildren="下架"
      onChange={() => this.checkedChange(record)}
      disabled={!this.props.permission.active}
    />
  );

  renderAction = (text, record) => (
    <React.Fragment>
      {this.props.permission.detail &&
      <Link to={{ pathname:`/Manage/NoticeDetail/${record.noticeId}`, state: { mode: 'view' } }}>详情</Link>}
      {this.props.permission.edit &&
      <Link
        disabled={record.status}
        to={{ pathname:`/Manage/NoticeDetail/${record.noticeId}`, state: { mode: 'edit' } }}
      >
        编辑
      </Link>}
      {this.props.permission.delete &&
      <Popconfirm
        title="确定要删除吗?"
        onConfirm={() => this.deleteConfirm(record.noticeId)}
      >
        <a disabled={record.status} type="primary">删除</a>
      </Popconfirm>}
    </React.Fragment>
  );

  render() {
    const {
      data,
      loading,
      page,
      load,
      searchParams,
      columns,
      changeSearch,
      topButtons,
    } = this.props;

    return (
      <ListPage
        columns={parseFields.call(this, columns)}
        rowKey="noticeId"
        title="公告管理"
        data={data}
        loading={loading}
        page={page}
        search={load}
        searchParams={searchParams}
        xScroll={800}
        changeSearch={changeSearch}
        topButtons={parseFields.call(this, topButtons)}
      />
    );
  }
}

export default View;
