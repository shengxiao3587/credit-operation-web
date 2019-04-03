import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import { parseFields } from '../../../../util';
import './index.scss';

export default class View extends Component {
  componentDidMount() {
    this.load();
  }

  load = () => {
    this.props.detail({
      applyNo: this.props.match.params.id,
    });
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      record,
      fields,
      topButtons,
      loading,
    } = this.props;
    return (
      <div className="orgview-container">
        <DetailPage
          layout="inline"
          loading={loading}
          values={record}
          topTitle="机构详情"
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            colSpan: field.colSpan || 12,
            disabled: true,
            containerClassName: field.containerClassName || 'orgview-field',
          })))}
          topButtons={parseFields.call(this, topButtons)}
        />
      </div>
    );
  }
}
