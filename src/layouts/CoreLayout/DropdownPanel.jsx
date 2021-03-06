import React, { Component } from 'react';
import { Menu, Icon, Dropdown, Modal } from 'antd';
import { connect } from 'react-redux';
// import { history } from '../../store/location';
import { common } from '../../store/common';
import './DropdownPanel.scss';

class DropdownPanel extends Component {
  onMenuClick({ key }) {
    if (key === '2') {
      this.props.showEditPwd();
    }
  }

  render() {
    const logout = () => {
      localStorage.setItem('accessToken', '');
      // history.push({ pathname: '/SignIn' });
      window.location.href = '/SignIn';
      window.storeManager.clear(); // clear the redux state, because the data is related the different roles
    };
    /* eslint-disable */
    const menu = (
      <Menu onClick={this.onMenuClick.bind(this)}>
        {/* <Menu.Item key="2">
          <a>修改密码</a>
        </Menu.Item> */}
        <Menu.Item key="3">
          <a
            tabIndex={0}
            role="button"
            onClick={(() => {
              Modal.confirm({
                title: '确定要退出FinTrack管理后台吗？',
                onOk: () => {
                  setTimeout(() => {
                    logout();
                  }, 300);
                },
                onCancel() {},
              });
            })}
          >退出
          </a>
        </Menu.Item>
      </Menu>
    );
    const background = this.props.avatar;
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="flex flex-c">
          <div style={{ backgroundImage:`url(${background})` }} className="login-img"/>
          <span className="login-name">
            {localStorage.getItem('user') &&
            (JSON.parse(localStorage.getItem('user')) || {}).username}，你好！<Icon type="down" />
          </span>
        </a>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state) => ({
  editPwdVisible: state.common.editPwdVisible,
  savePwdLoading: state.common.savePwdLoading,
  avatar: state.common.avatar || JSON.parse(localStorage.getItem('user') || '{}').avatar,
});

const mapDispatchToProps = {
  showEditPwd: common.showEditPwd,
  hideEditPwd: common.hideEditPwd,
  savePwd: common.savePwd,
  initCommon: common.initCommon,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownPanel);
