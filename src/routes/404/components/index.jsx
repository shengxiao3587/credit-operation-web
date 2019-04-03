import React, { Component } from 'react';
import { Button } from 'antd';
import { history } from '../../../store/location';
import './style.scss';

class View extends Component {
  componentDidMount() {
  }
  /* eslint-disable */
  render() {
    return (
      <div style={{ width: '100%' }} className="flex flex-c miss-wrapper">
        <div className="miss-img-container"><img alt="" style={{ width: '100%' }} src="/404.png" /></div>
        <div className="flex flex-c flex-v" style={{ alignItems: 'start' }}>
          <div className="miss-404">404</div>
          <div className="miss-slogan">很抱歉，您访问的页面已丢失</div>
          <div>
            <Button
              type="default"
              onClick={() => history.goBack()}
            >返回上一页</Button>
            <Button
              type="default"
              onClick={() => history.push('/Manage')}
            >返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default View;
