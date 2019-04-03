import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { common } from '../../store/common';
import DropdownPanelWrapper from './DropdownPanel';
import TopMenu from './TopMenu';
import respond from '../../decorators/Responsive';

const { Header } = Layout;

class TopHeader extends Component {
  render() {
    const {
      expand,
      menus,
      clickTopMenu,
      selectedTopKeys,
    } = this.props;

    return (
      <Header className="header flex flex-js">
        <TopMenu expand={expand} menus={menus} onClick={clickTopMenu} selectedKeys={selectedTopKeys} />
        <DropdownPanelWrapper />
      </Header>
    );
  }
}

const TopHeaderWrapper = connect((state) => ({
  selectedKeys: state.common.selectedTopKeys,
  firstLeaf: state.common.firstLeaf,
  menus: state.common.menus,
  selectedTopKeys: state.common.selectedTopKeys,
}), {
  clickTopMenu: common.clickTopMenu,
  initMenu: common.initMenu,
})(TopHeader);

export default respond(TopHeaderWrapper, 1000);
