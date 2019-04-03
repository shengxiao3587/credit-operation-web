import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.load({
      ...this.props.searchParams,
    });
  }

  add = () => {
    this.props.history.push('/Manage/OrganitionDetail/0');
  };

  renderAction = (text, record) => {
    return (
      <React.Fragment>
        {this.props.permission.edit && <Link to={`/Manage/OrganizationDetail/${record.orgId}`}>编辑</Link>}
        {this.props.permission.detail && <Link to={`/Manage/OrganizationView/${record.orgId}`}>明细</Link>}
      </React.Fragment>
    );
  };

  render() {
    const {
      breadcrumb,
      data,
      loading,
      page,
      load,
      changeSearch,
      searchParams,
      columns,
      buttons,
    } = this.props;

    return (
      <ListPage
        rowKey="orgId"
        title="机构管理"
        columns={parseFields.call(this, columns)}
        breadcrumb={breadcrumb}
        data={data}
        loading={loading}
        page={page}
        search={load}
        changeSearch={changeSearch}
        searchParams={searchParams}
        xScroll={800}
        searchButtonSpan={2}
        topButtons={parseFields.call(this, buttons)}
      />
    );
  }
}

export default View;
