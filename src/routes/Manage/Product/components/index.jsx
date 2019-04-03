import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  load() {
    const { loadFinatialProducts, searchParams, page } = this.props;
    loadFinatialProducts({
      ...searchParams,
      ...page,
    });
  }

  refresh = () => {
    this.load();
  };

  renderAction = (text, record) => {
    return (
      <React.Fragment>
        {this.props.permission.edit && <Link to={`/Manage/ProductDetail/${record.prodNo}#edit`}>编辑</Link>}
        {this.props.permission.detail && <Link to={`/Manage/ProductDetail/${record.prodNo}#detail`}>明细</Link>}
      </React.Fragment>
    );
  };

  render() {
    const {
      columnData,
      loading,
      page,
      columns,
      topButtons,
      searchParams,
      loadFinatialProducts,
      changeSearchParams,
    } = this.props;

    return (
      <ListPage
        rowKey="prodNo"
        title="金融产品"
        columns={parseFields.call(this, columns)}
        data={columnData}
        loading={loading}
        page={page}
        topButtons={parseFields.call(this, topButtons)}
        search={loadFinatialProducts}
        changeSearch={changeSearchParams}
        searchParams={searchParams}
        noSearch
      />
    );
  }
}

export default View;
