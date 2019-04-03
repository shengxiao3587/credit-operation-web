import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const REPAYAUDITLIST_REQUEST = 'REPAYAUDITLIST_REQUEST';
const REPAYAUDITLIST_SUCCESS = 'REPAYAUDITLIST_SUCCESS';
const REPAYAUDITLIST_FAILURE = 'REPAYAUDITLIST_FAILURE';
const REPAYAUDITLIST_SEARCH_CHANGE = 'REPAYAUDITLIST_SEARCH_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [REPAYAUDITLIST_REQUEST, REPAYAUDITLIST_SUCCESS, REPAYAUDITLIST_FAILURE],
    callAPI: () => fetch('/repay/audit/list', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction('REPAYAUDITLIST_SEARCH_CHANGE', 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  page: {
    pageSize: 10,
    pageNo: 1,
  },
  columns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '业务编号',
      name: 'applyNo',
    },
    {
      label: '提交时间',
      name: 'createTime',
      type: 'datetimeRange',
      search: true,
      col: 10,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '客户名称',
      name: 'entName',
      search: true,
      col: 6,
    },
    {
      label: '还款总额',
      name: 'totalRepayAmount',
      align: 'right',
      render: 'func:renderAmount',
    },
    {
      label: '实际还款日',
      name: 'actualRepayTime',
      type: 'date',
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      data: {
        1: '待审核',
        2: '审核通过',
        3: '驳回',
      },
      search: true,
      col: 6,
      render: 'func:renderStatus',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [REPAYAUDITLIST_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [REPAYAUDITLIST_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.total,
    },
  }),
  [REPAYAUDITLIST_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [REPAYAUDITLIST_SEARCH_CHANGE]: (state, action) => ({
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
