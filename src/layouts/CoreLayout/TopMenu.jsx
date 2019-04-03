/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Icon, Dropdown } from 'antd';

export default (props) => {
  const renderMenu = () => {
    return (
      <Menu
        selectedKeys={props.selectedKeys}
        onClick={({ key }) => {
          props.onClick(key);
        }}
        mode={props.expand ? 'horizontal' : 'vertical'}
      >
        {props.menus.map((menu) => (
          <Menu.Item key={menu.id}>
            {menu.icon && <Icon type={menu.icon} />}<span>{menu.name}</span>
          </Menu.Item>
          ))}
      </Menu>
    );
  };

  return (
    props.expand ? renderMenu() :
    <Dropdown overlay={renderMenu()} trigger={['click']}>
      <a className="ant-dropdown-link">
        <span>菜单</span>
        <Icon type="down" />
      </a>
    </Dropdown>
  );
};
