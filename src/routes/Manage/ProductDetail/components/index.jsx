import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import { parseFields } from '../../../../util';
import validRate from './validRate';

import './style.scss';

const typeIsObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

class View extends Component {
  componentDidMount() {
    this.props.dict('repayType');
    this.props.dict('rateType');
    this.load();
    const { location, setPageMode } = this.props;
    const pageMode = location.hash.slice(1);
    setPageMode(pageMode);
  }

  load() {
    const { id } = this.props.match.params;
    this.props.load({
      id,
    });
  }

  _formattedRate = (object, single, keyName = 'penaltyRate') => {
    const obj = single ? object : object[keyName];
    const newObject = object;
    let value = '';

    for (let i = 0; i < Object.keys(obj).length - 6; i += 1) {
      const partOfRate = obj[i];
      value += partOfRate;
    }
    if (!single && typeof object[keyName] !== 'number') {
      newObject[keyName] = value;
    }
    return value;
  }

  checkValueRate = (rule, value, callback) => {
    let v = value === undefined ? '' : value;
    if (typeIsObject(value)) {
      v = this._formattedRate(value, true);
    }
    if (!validRate(v)) {
      callback('请输入格式正确的借款利率');
    }
    callback();
  };

  checkProdIntroduce = (rule, value, callback) => {
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === ' ') {
        callback('产品介绍不能包含空格');
      }
    }
    callback();
  }

  submit = (form) => {
    // force is important, as default the value not change won't validate the rules
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        // this._formattedRate(values, false);
        // this._formattedRate(values, false, 'compoundRate');
        this.props.save(values).then((success) => {
          if (success) {
            this.props.history.push('/Manage/Product');
          }
        });
      }
    });
  };

  back = () => {
    this.props.history.goBack();
  };

  refresh = () => {
    this.load();
  };

  renderRepayType = () => {
    return this.props.dicts.repayType;
  };

  renderRateType = () => {
    return this.props.dicts.rateType;
  };

  renderHref = () => {
    return `/Manage/SurveyModal/${this.props.match.params.id}#${this.props.pageMode}`;
  };

  render() {
    const {
      record,
      changeRecord,
      breadcrumb,
      fields,
      buttons,
      topButtons,
      pageMode,
      loading,
    } = this.props;
    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i];
      field.disabled = pageMode === 'detail' || field.name === 'config';
    }
    return (
      <div className="product-detail-container">
        <DetailPage
          loading={loading}
          topTitle="产品参数设置"
          values={record}
          changeRecord={changeRecord}
          breadcrumb={breadcrumb}
          fields={parseFields.call(this, fields)}
          buttons={pageMode === 'detail' ? [] : parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
        />
      </div>
    );
  }
}

export default View;
