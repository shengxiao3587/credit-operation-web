import fetch from '@f12/fetch';
import { DateUtil } from '@xinguang/common-tool';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const CUSTOMER_REQUEST = 'CUSTOMER_REQUEST';
const CUSTOMER_SUCCESS = 'CUSTOMER_SUCCESS';
const CUSTOMER_FAILURE = 'CUSTOMER_FAILURE';
const CUSTOMER_SEARCH_CHANGE = 'CUSTOMER_SEARCH_CHANGE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [CUSTOMER_REQUEST, CUSTOMER_SUCCESS, CUSTOMER_FAILURE],
    callAPI: () => fetch('/customer/list', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction(CUSTOMER_SEARCH_CHANGE, 'fields'),
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
      align:'left',
    },
    {
      label: '登录邮箱',
      name: 'email',
      search: true,
      col: 6,
      labelCol: 6,
      wrapperCol: 18,
    },
    {
      label: '注册时间',
      name: 'registerTime',
      type: 'datetimeRange',
      search: true,
      col: 10,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '最近登录时间',
      name: 'lastLoginTime',
    },
    {
      label: '最近登录IP',
      name: 'lastLoginIP',
    },
  ],
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
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [CUSTOMER_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [CUSTOMER_SUCCESS]: (state, action) => {
    const {
      list,
    } = action.data;
    const data = [];
    list.map((item) =>
      data.push({
        email: item.email,
        lastLoginIP: item.lastLoginIP,
        customerId: item.customerId,
        registerTime: DateUtil.formatDate(item.registerTime, 'yyyy-MM-dd HH:mm'),
        lastLoginTime: DateUtil.formatDate(item.lastLoginTime, 'yyyy-MM-dd HH:mm'),
      }));
    return {
      ...state,
      data,
      loading: false,
      page: {
        pageNo: action.data.pageNo,
        pageSize: action.data.pageSize,
        total: action.data.totalSize,
      },
    };
  },
  [CUSTOMER_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [CUSTOMER_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
