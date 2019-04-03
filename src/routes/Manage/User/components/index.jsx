import React, { Component } from 'react';
import { Popconfirm, Icon } from 'antd';
import { Link } from 'react-router-dom';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';
import './index.scss';

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleId: '',
    };
  }
  componentDidMount() {
    this.load();
  }
  componentWillUnmount() {
    this.props.reset();
  }

  load() {
    this.props.loadRole().then((success) => {
      success && this.props.load({
        ...this.props.searchParams,
        ...this.props.page,
        roleName:this.props.selectedRole,
      });
    });
  }

  clickAddUser = () => {
    this.props.history.push('/Manage/UserDetail/new');
  };

  roleNameClick = (item) => {
    this.props.setSelectedRole(item.roleName);
    this.props.loadRole().then((success) => {
      success && this.props.load({
        ...this.props.searchParams,
        ...this.props.page,
        roleName:item.roleName,
      });
    });
  };

  refresh = () => {
    this.load();
  };

  renderAction = (text, record) => {
    return (
      <React.Fragment>
        {this.props.permission.userEdit && <Link to={`/Manage/UserDetail/${record.userId}`}>编辑</Link>}
        {this.props.permission.userDelete &&
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            this.props.deleteUser({ userId:record.userId }).then((s) => {
              s && this.load();
            });
          }}
        >
          <a type="primary">删除</a>
        </Popconfirm>}
      </React.Fragment>
    );
  };
  renderLeftPane = () => (
    <div className="leftPane">
      <div className="leftPane-title">
        <span>角色管理</span>
        <span>{`所有用户 (${this.props.allUser || ''})`}</span>
      </div>
      <div className="leftPane-content">
        {this.props.roleData.map((item, index) => {
          const key1 = `leftPane-content-row${index}`;
          let roleClassName = 'roleName';
          if (item.selected === true) {
            roleClassName = 'roleName selected';
          }
          return (
            <div
              className="leftPane-content-row"
              key={key1}
              onMouseEnter={() => { this.setState({ roleId:item.roleId }); }}
              onFocus={() => true}
              onMouseLeave={() => { this.setState({ roleId:'' }); }}
              onBlur={() => true}
            >
              <div
                className={roleClassName}
                role="presentation"
                onClick={() => {
                   this.roleNameClick(item);
              }}
              >
                {item.roleName}
              </div>
              {this.state.roleId === item.roleId &&
                <div className="roleButton">
                  {
                    this.props.permission.roleEdit &&
                    <Icon type="edit" style={{ color:'#3373cc', marginRight:'5px' }} />
                  }
                  {
                    this.props.permission.roleEdit &&
                    <Link style={{ marginRight:'8px' }} to={`/Manage/RoleDetail/${item.roleId}`}>编辑</Link>
                  }
                  {
                    this.props.permission.roleDelete &&
                    <Icon type="delete" style={{ color:'#3373cc', marginRight:'5px' }} />
                  }
                  {
                    this.props.permission.roleDelete &&
                    <Popconfirm
                      title="确定要删除吗?"
                      onConfirm={() => {
                        this.props.deleteRole({ roleId:item.roleId }).then((s) => {
                          s && this.load();
                        });
                      }}
                    >
                      <a type="primary">删除</a>
                    </Popconfirm>
                  }
                </div>
              }
            </div>);
        })}
      </div>
      {this.props.permission.roleAdd &&
      <div className="leftPane-foot">
        <Icon type="plus" style={{ marginRight: '5px' }} />
        <Link to="/Manage/RoleDetail/new">添加新角色</Link>
      </div>}

    </div>
  );

  render() {
    const {
      data,
      loading,
      page,
      load,
      searchParams,
      columns,
      changeSearch,
      buttons,
      topButtons,
    } = this.props;
    const leftPane = this.renderLeftPane();

    return (
      <div className="user-list-container">
        <ListPage
          rowKey="userId"
          title="用户管理"
          columns={parseFields.call(this, columns)}
          data={data}
          loading={loading}
          page={page}
          search={load}
          searchParams={searchParams}
          changeSearch={changeSearch}
          buttons={parseFields.call(this, buttons)}
          topButtons={parseFields.call(this, topButtons)}
          leftPane={leftPane}
          searchButtonSpan={2}
        />
      </div>
    );
  }
}

export default View;
