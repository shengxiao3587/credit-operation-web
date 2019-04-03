import React, { Component } from 'react';
import { DetailPage } from '@f12/components';
import { parseFields } from '../../../../util';
import { shapeList } from './util';


class View extends Component {
  componentDidMount() {
    this.load();
  }

  onCheck = (checked, e) => {
    this.props.onCheck(checked);
    this.props.halfChecked(e.halfCheckedKeys);
  };

  getPermissionsData = () => {
    if (this.props.list) {
      return shapeList(this.props.list);
    }
    return [];
  };

  load() {
    if (this.props.match.params.id === 'new') {
      this.props.load();
    } else {
      this.props.load({
        roleId: this.props.match.params.id,
      });
    }
  }

  refresh = () => {
    this.load();
  };

  submit = (form) => {
    // force is important, as default the value not change won't validate the rules
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      const newValues = values;
      if (!err) {
        newValues.roleName = values.roleName;
        newValues.roleId = this.props.match.params.id === 'new'
          ? '' : this.props.match.params.id;
        const permissions = this.props.record.permissions.value
          ? this.props.record.permissions.value : this.props.record.permissions;
        newValues.resourceIds = [...permissions, ...this.props.halfCheckedKeys].join(',');
        this.props.save(newValues).then((success) => {
          if (success) {
            this.props.history.goBack();
          }
        });
      }
    });
  };

  back = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      record,
      changeRecord,
      fields,
      buttons,
      topButtons,
    } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <DetailPage
          values={record}
          changeRecord={changeRecord}
          topTitle="添加角色"
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

export default View;
