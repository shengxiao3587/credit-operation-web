import React, { Component } from 'react';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  load() {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.page,
    });
  }
  refresh = () => {
    this.load();
  };

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
        rowKey="email"
        title="客户列表"
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
