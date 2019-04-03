import React, { Component } from 'react';
import { Input, Switch } from 'antd';
import './style.scss';

export default class InputWithSwitch extends Component {
  constructor(props) {
    super(props);
    this.inPageDetail = this.props.location.hash.slice(1) === 'detail';
    this.addonAfter = this.inPageDetail ? '' : '%';
    this.placeholder = '请输入利率';
    this.state = {
      switchClose: false,
      inputDisabled: this.inPageDetail,
      addonAfter: this.addonAfter,
      placeholder: this.placeholder,
      inputValue: '',
      switchHidden: this.inPageDetail,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({
        inputValue: value,
      });
    }
  }

  enableUserInput = (checked) => {
    const inputDisabled = !checked;
    const addonAfter = checked ? this.addonAfter : '';
    const placeholder = checked ? this.placeholder : '';
    const inputValue = '';
    this.setState({
      inputDisabled,
      addonAfter,
      placeholder,
      inputValue,
      switchClose: inputDisabled,
    });
    this.triggerChange(inputValue);
  }

  handleInputValueChange = (event) => {
    const inputValue = event.target.value;
    this.setState({
      inputValue,
    });
    this.triggerChange(inputValue);
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const {
      inputDisabled,
      addonAfter,
      placeholder,
      switchClose,
    } = this.state;
    let { inputValue } = this.state;
    let value = '';
    if (typeof inputValue === 'object') {
      Object.keys(inputValue).forEach((key, index) => {
        const partOfInputValue = inputValue[index];
        if (partOfInputValue !== undefined) {
          value += partOfInputValue;
        }
      });
      if ('0' in inputValue) {
        inputValue = value;
      } else {
        inputValue = '';
      }
    }

    return (
      <div className="input-with-switch">
        <Switch
          onChange={this.enableUserInput}
          hidden={this.state.switchHidden}
          defaultChecked
        />
        <Input
          placeholder={placeholder}
          addonAfter={addonAfter}
          disabled={inputDisabled}
          onChange={this.handleInputValueChange}
          defaultValue={inputValue}
          hidden={switchClose}
        />
      </div>
    );
  }
}
