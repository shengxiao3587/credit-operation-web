import fetch from '@f12/fetch';
import { createAction, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const USERDETAIL_LOAD_REQUEST = 'USERDETAIL_LOAD_REQUEST';
const USERDETAIL_LOAD_SUCCESS = 'USERDETAIL_LOAD_SUCCESS';
const USERDETAIL_LOAD_FAILURE = 'USERDETAIL_LOAD_FAILURE';
const USERDETAIL_SAVE_REQUEST = 'USERDETAIL_SAVE_REQUEST';
const USERDETAIL_SAVE_SUCCESS = 'USERDETAIL_SAVE_SUCCESS';
const USERDETAIL_SAVE_FAILURE = 'USERDETAIL_SAVE_FAILURE';
const USERDETAIL_RECORD_CHANGE = 'USERDETAIL_RECORD_CHANGE';
const USERDETAIL_FORM_PERSIST = 'USERDETAIL_FORM_PERSIST';

const USERDETAIL_ROLE_REQUEST = 'USERDETAIL_ROLE_REQUEST';
const USERDETAIL_ROLE_SUCCESS = 'USERDETAIL_ROLE_SUCCESS';
const USERDETAIL_ROLE_FAILURE = 'USERDETAIL_ROLE_FAILURE';

const USERDETAIL_RESET = 'USERDETAIL_RESET';

const initialState = {
  form : null,
  roleData:[],
  fields: [
    {
      label: '所属组织',
      name: 'bankId',
      type: 'select',
      data: 'func:getBankData:run',
      disabled: 'func:isEdit:run',
      required: true,
    },
    {
      label: '登录账号',
      name: 'userName',
      disabled: 'func:isEdit:run',
      max: 50,
      required: true,
    },
    {
      label: '密码',
      name: 'password',
      type: 'password',
      validator: 'func:passwordValidate',
      hidden: 'func:isEdit:run',
      placeholder: '请输入密码',
      required: true,
    },
    {
      label: '确认密码',
      name: 'confirmPassword',
      type: 'password',
      validator: 'func:confirmPasswordValidate',
      hidden:'func:isEdit:run',
      placeholder: '请再次输入密码',
      required: true,
    },
    {
      label: '账号所属人',
      name: 'contactName',
      placeholder: '请输入账号使用者',
      max: 50,
      required: true,
    },
    {
      label: '手机号',
      name: 'contactPhone',
      placeholder: '请输入账号使用者的手机号',
      phone: true,
      required: true,
    },
    {
      label: '选择角色',
      name: 'roles',
      type: 'transfer',
      data:'func:getRoleData:run',
      requiredMsg: '请选择角色',
      required: true,
    },
  ],
  buttons: [
    {
      label: '取消',
      onClick: 'func:back',
      type: 'default',
    },
    {
      label: '保存',
      onClick: 'func:submit',
    },
  ],
  topButtons: [
    {
      label: '刷新',
      onClick: 'func:refresh',
      icon: 'sync',
      loading: 'props:loading',
      type: 'default',
    },
    {
      label: '返回',
      onClick: 'func:back',
      icon: 'rollback',
      type: 'default',
    },
  ],
};

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [USERDETAIL_LOAD_REQUEST, USERDETAIL_LOAD_SUCCESS, USERDETAIL_LOAD_FAILURE],
    callAPI: () => fetch('/user/detail', params),
  }),
  save: (params) => ({
    types: [USERDETAIL_SAVE_REQUEST, USERDETAIL_SAVE_SUCCESS, USERDETAIL_SAVE_FAILURE],
    callAPI: () => fetch('/user/update', params),
  }),
  loadRole: () => ({
    types: [USERDETAIL_ROLE_REQUEST, USERDETAIL_ROLE_SUCCESS, USERDETAIL_ROLE_FAILURE],
    callAPI: () => fetch('/role/list'),
  }),
  changeRecord: createAction('USERDETAIL_RECORD_CHANGE', 'fields'),
  persistForm: createAction(USERDETAIL_FORM_PERSIST, 'form'),
  reset: createAction(USERDETAIL_RESET),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USERDETAIL_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_LOAD_SUCCESS]: (state, action) => {
    const { data } = action;
    const roles = [];
    data.roles.map((item) => roles.push(item.roleId));
    return {
      ...state,
      record: {
        ...data,
        roles,
      },
      loading: false,
    };
  },
  [USERDETAIL_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_SAVE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_SAVE_SUCCESS]: (state) => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_SAVE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_ROLE_REQUEST] : (state) => ({
    ...state,
  }),
  [USERDETAIL_ROLE_SUCCESS]: (state, action) => {
    const { list } = action.data;
    const roleData = [];
    list.map((item) => roleData.push({
      key: item.roleId,
      title: item.roleName,
    }));
    return {
      ...state,
      roleData,
    };
  },
  [USERDETAIL_ROLE_FAILURE]: (state) => ({
    ...state,
  }),
  [USERDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [USERDETAIL_FORM_PERSIST]: (state, action) => ({
    ...state,
    form: action.form,
  }),
  [USERDETAIL_RESET]: (state) => ({
    ...state,
    record: mapToAntdFields(initialState.fields),
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------

initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
