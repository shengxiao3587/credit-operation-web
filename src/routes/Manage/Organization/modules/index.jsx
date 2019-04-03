import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const ORGANIZATION_REQUEST = 'ORGANIZATION_REQUEST';
const ORGANIZATION_SUCCESS = 'ORGANIZATION_SUCCESS';
const ORGANIZATION_FAILURE = 'ORGANIZATION_FAILURE';
const ORGANIZATION_SEARCH_CHANGE = 'ORGANIZATION_SEARCH_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [ORGANIZATION_REQUEST, ORGANIZATION_SUCCESS, ORGANIZATION_FAILURE],
    callAPI: () => fetch('/org/list', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction('ORGANIZATION_SEARCH_CHANGE', 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  columns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '编号',
      name: 'orgId',
    },
    {
      label: '地区',
      name: 'address',
    },
    {
      label: '机构名称',
      name: 'orgName',
      search: true,
    },
    {
      label: '联系人',
      name: 'contactPerson',
    },
    {
      label: '创建时间',
      name: 'createTime',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  buttons: [{
    label: '新增',
    onClick: 'func:add',
  }],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [ORGANIZATION_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [ORGANIZATION_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.totalSize,
    },
  }),
  [ORGANIZATION_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [ORGANIZATION_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
