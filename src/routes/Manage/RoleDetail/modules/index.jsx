import fetch from '@f12/fetch';
import { createAction, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const ROLEDETAIL_LOAD_REQUEST = 'ROLEDETAIL_LOAD_REQUEST';
const ROLEDETAIL_LOAD_SUCCESS = 'ROLEDETAIL_LOAD_SUCCESS';
const ROLEDETAIL_LOAD_FAILURE = 'ROLEDETAIL_LOAD_FAILURE';

const ROLEDETAIL_SAVE_REQUEST = 'ROLEDETAIL_SAVE_REQUEST';
const ROLEDETAIL_SAVE_SUCCESS = 'ROLEDETAIL_SAVE_SUCCESS';
const ROLEDETAIL_SAVE_FAILURE = 'ROLEDETAIL_SAVE_FAILURE';

const ROLEDETAIL_RECORD_CHANGE = 'ROLEDETAIL_RECORD_CHANGE';

const ROLEDETAIL_ONCHECK = 'ROLEDETAIL_ONCHECK';

const ROLEDETAIL_HALFCHECKED = 'ROLEDETAIL_HALFCHECKED';

const initialState = {
  fields: [
    {
      label: '角色名称',
      name: 'roleName',
      max: 50,
    },
    {
      label: '权限分配',
      name: 'permissions',
      type: 'tree',
      data: 'func:getPermissionsData:run',
      onCheck: 'func:onCheck',
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
  list: [],
  halfCheckedKeys: [],
};
initialState.record = mapToAntdFields(initialState.fields);

const listToCheckedKeys = (list) => {
  const checkedKeys = [];
  const setKey = (l) => {
    l.map((item) => {
      if (item.children && item.children.length > 0 && item.isChoosen === 1) {
        setKey(item.children);
      } else if (item.isChoosen === 1) {
        checkedKeys.push(item.resourceId);
      }
      return true;
    });
  };
  setKey(list);
  return checkedKeys;
};

const listToHalfChecked = (list) => {
  const halfCheckedKeys = [];
  const setHalfKey = (l) => {
    l.map((item) => {
      if (item.children && item.children.length > 0 && item.isChoosen === 1) {
        halfCheckedKeys.push(item.resourceId);
        setHalfKey(item.children);
      }
      return true;
    });
  };
  setHalfKey(list);
  return halfCheckedKeys;
};

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [ROLEDETAIL_LOAD_REQUEST, ROLEDETAIL_LOAD_SUCCESS, ROLEDETAIL_LOAD_FAILURE],
    callAPI: () => fetch('/role/detail', params),
  }),
  save: (params) => ({
    types: [ROLEDETAIL_SAVE_REQUEST, ROLEDETAIL_SAVE_SUCCESS, ROLEDETAIL_SAVE_FAILURE],
    callAPI: () => fetch('/role/update', params),
  }),
  changeRecord: createAction(ROLEDETAIL_RECORD_CHANGE, 'fields'),
  onCheck: createAction(ROLEDETAIL_ONCHECK, 'checked'),
  halfChecked :createAction(ROLEDETAIL_HALFCHECKED, 'half'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ROLEDETAIL_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [ROLEDETAIL_LOAD_SUCCESS]: (state, action) => {
    const { roleName, list } = action.data;
    const permissions = listToCheckedKeys(list);
    const halfCheckedKeys = listToHalfChecked(list);
    return {
      ...state,
      record: {
        roleName,
        permissions,
      },
      list,
      loading: false,
      halfCheckedKeys,
    };
  },
  [ROLEDETAIL_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [ROLEDETAIL_SAVE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [ROLEDETAIL_SAVE_SUCCESS]: (state) => ({
    ...state,
    loading: false,
  }),
  [ROLEDETAIL_SAVE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [ROLEDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [ROLEDETAIL_ONCHECK]: (state, action) => ({
    ...state,
    record: {
      ...state.record,
      permissions: action.checked,
    },
  }),
  [ROLEDETAIL_HALFCHECKED]: (state, action) => ({
    ...state,
    halfCheckedKeys: [...action.half],
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------


export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
