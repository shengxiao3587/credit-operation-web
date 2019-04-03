import fetch from '@f12/fetch';
import { mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const LOGINLOG_REQUEST = 'LOGINLOG_REQUEST';
const LOGINLOG_SUCCESS = 'LOGINLOG_SUCCESS';
const LOGINLOG_FAILURE = 'LOGINLOG_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [LOGINLOG_REQUEST, LOGINLOG_SUCCESS, LOGINLOG_FAILURE],
    callAPI: () => fetch('/user/log/list', mapToSendData(params)),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  page: {
    pageNo: 1,
    pageSize: 10,
  },
  columns: [
    {
      label: '时间',
      name: 'loginTime',
      type: 'datetime',
    },
    {
      label: 'IP',
      name: 'loginIp',
    },
    {
      label: '地区',
      name: 'loginAddress',
    },
  ],
  buttons: [{
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [LOGINLOG_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [LOGINLOG_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.totalSize,
    },
  }),
  [LOGINLOG_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
