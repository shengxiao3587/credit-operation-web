import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const USER_REQUEST = 'USER_REQUEST';
const USER_SUCCESS = 'USER_SUCCESS';
const USER_FAILURE = 'USER_FAILURE';

const USER_ROLE_REQUEST = 'USER_ROLE_REQUEST';
const USER_ROLE_SUCCESS = 'USER_ROLE_SUCCESS';
const USER_ROLE_FAILURE = 'USER_ROLE_FAILURE';

const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST';
const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS';
const USER_DELETE_FAILURE = 'USER_DELETE_FAILURE';

const USER_ROLE_DELETE_REQUEST = 'USER_ROLE_DELETE_REQUEST';
const USER_ROLE_DELETE_SUCCESS = 'USER_ROLE_DELETE_SUCCESS';
const USER_ROLE_DELETE_FAILURE = 'USER_ROLE_DELETE_FAILURE';

const USER_SEARCH_CHANGE = 'USER_SEARCH_CHANGE';
const USER_SET_SELECTEDROLE = 'USER_SET_SELECTEDROLE';
const USER_RESET = 'USER_RESET';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
    callAPI: () => fetch('/user/list', mapToSendData(params)),
  }),
  loadRole: () => ({
    types: [USER_ROLE_REQUEST, USER_ROLE_SUCCESS, USER_ROLE_FAILURE],
    callAPI: () => fetch('/role/list'),
  }),
  deleteUser: (params) => ({
    types: [USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAILURE],
    callAPI: () => fetch('/user/delete', params),
  }),
  deleteRole: (params) => ({
    types: [USER_ROLE_DELETE_REQUEST, USER_ROLE_DELETE_SUCCESS, USER_ROLE_DELETE_FAILURE],
    callAPI: () => fetch('/role/delete', params),
  }),
  changeSearch: createAction(USER_SEARCH_CHANGE, 'fields'),
  setSelectedRole:createAction(USER_SET_SELECTEDROLE, 'fields'),
  reset:createAction(USER_RESET),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  columns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '登录账号',
      name: 'userName',
      search: true,
      col: 6,
      labelCol: 6,
      wrapperCol: 18,
    },
    {
      label: '角色',
      name: 'roleName',
    },
    {
      label: '账户所属人',
      name: 'contactName',
      search: true,
      col: 6,
      labelCol: 8,
      wrapperCol: 16,
    },
    {
      label: '创建日期',
      name: 'createTime',
      type: 'datetimeRange',
      search: true,
      col: 10,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '最后登录时间',
      name: 'lastLoginTime',
      type: 'datetimeRange',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  buttons: [{
    label: '新增',
    onClick: 'func:clickAddUser',
    hidden:'props:!permission.userAdd',
  }],
  topButtons: [{
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
  page: {
    pageSize: 10,
    pageNo: 1,
  },
  selectedRole:'',
  loading: false,
  data: [],
  roleData:[],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [USER_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [USER_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.totalSize,
    },
  }),
  [USER_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [USER_ROLE_REQUEST] : (state) => ({
    ...state,
  }),
  [USER_ROLE_SUCCESS]: (state, action) => {
    const { list, adminUserCounts } = action.data;
    const newList = [];
    list.map((item) => newList.push({
      roleId:item.roleId,
      roleName:item.roleName,
      selected:false,
    }));
    let newSelectedRole = '';
    if (newList.length !== 0) {
      if (state.selectedRole === '') {
        newList[0].selected = true;
        newSelectedRole = newList[0].roleName;
      } else {
        newSelectedRole = state.selectedRole;
        newList.forEach((item) => {
          const newItem = item;
          if (item.roleName === state.selectedRole) {
            newItem.selected = true;
          }
        });
      }
    }

    return {
      ...state,
      roleData: newList,
      allUser:adminUserCounts,
      selectedRole:newSelectedRole,
    };
  },
  [USER_ROLE_FAILURE]: (state) => ({
    ...state,
  }),
  [USER_DELETE_REQUEST] : (state) => ({
    ...state,
  }),
  [USER_DELETE_SUCCESS]: (state) => ({
    ...state,
  }),
  [USER_DELETE_FAILURE]: (state) => ({
    ...state,
  }),
  [USER_ROLE_DELETE_REQUEST] : (state) => ({
    ...state,
  }),
  [USER_ROLE_DELETE_SUCCESS]: (state) => ({
    ...state,
  }),
  [USER_ROLE_DELETE_FAILURE]: (state) => ({
    ...state,
  }),
  [USER_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  [USER_SET_SELECTEDROLE]: (state, action) => ({
    ...state,
    selectedRole:action.fields,
  }),
  [USER_RESET]:() => ({
    ...initialState,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
