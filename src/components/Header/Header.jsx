import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';
import './style.scss';

class Header extends Component {
  buttons = () => {
    const { buttonsUsage, callbacks } = this.props;
    const {
      modalOpen,
      refresh,
      back,
    } = callbacks;
    const buttonMapper = {
      new: (<Button type="primary" key="new" onClick={modalOpen}>新增</Button>),
      refresh: (
        <Button
          id="id-button-new"
          type="default"
          icon="sync"
          onClick={refresh}
          key="refresh"
        >刷新
        </Button>
      ),
      back: (<Button key="back" icon="rollback" onClick={back}>返回</Button>),
    };
    const buttons = [];
    for (let i = 0; i < buttonsUsage.length; i += 1) {
      const usage = buttonsUsage[i];
      buttons.push(buttonMapper[usage]);
    }
    return buttons;
  }

  render() {
    const buttons = this.buttons();
    return (
      <Row id="id-sidebox-title">
        <Col className="col-content">{this.props.title}</Col>
        <Col id="id-col-button">
          {buttons}
        </Col>
      </Row>
    );
  }
}

export default Header;
