import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import { parseFields } from '../../../../util';
import './index.scss';

export default class View extends Component {
  componentDidMount() {
    if (+this.props.match.params.id) {
      this.edit = true;
    }
    this.load();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  load = () => {
    if (this.edit) {
      this.props.detail({
        orgId: this.props.match.params.id,
      });
    }
  };

  refresh = () => {
    this.load();
  };

  back = () => {
    this.props.history.goBack();
  };

  save = (form) => {
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        this.props.save(values).then((success) => {
          if (success) {
            this.props.history.push('/Manage/Organization');
          }
        });
      }
    });
  };

  render() {
    const {
      record,
      fields,
      buttons,
      topButtons,
      loading,
      changeRecord,
    } = this.props;
    return (
      <div className="orgdetail-container">
        <DetailPage
          loading={loading}
          values={record}
          topTitle={`${this.edit ? '编辑' : '新增'}机构`}
          changeRecord={changeRecord}
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            required: true,
          })))}
          buttons={parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
        />
      </div>
    );
  }
}
