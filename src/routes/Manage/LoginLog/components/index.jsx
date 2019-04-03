import React, { Component } from 'react';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.load({
      ...this.props.page,
    });
  }

  refresh = () => {
    this.props.load({
      ...this.props.page,
    });
  };

  render() {
    const {
      data,
      loading,
      page,
      load,
      columns,
      buttons,
    } = this.props;

    return (
      <ListPage
        rowKey="logId"
        noSearch
        columns={parseFields.call(this, columns)}
        data={data}
        loading={loading}
        page={page}
        search={load}
        xScroll={300}
        buttons={parseFields.call(this, buttons)}
        title="登录日志"
        buttonPos="top"
      />
    );
  }
}

export default View;
