import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: ['EXAMINELIST_REQUEST', 'EXAMINELIST_SUCCESS', 'EXAMINELIST_FAILURE'],
    callAPI: () => fetch('/credit/apply/list', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction('EXAMINELIST_SEARCH_CHANGE', 'fields'),
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
      label: '业务编号',
      name: 'applyNo',
    },
    {
      label: '申请时间',
      name: 'applyTime',
      type: 'datetimeRange',
      search: true,
      col: 9,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '邮箱',
      name: 'email',
    },
    {
      label: '客户名称',
      name: 'entName',
      search: true,
      col: 6,
    },
    {
      label: '贷款金额',
      name: 'loanAmount',
      render: 'func:renderPrice',
      align: 'right',
    },
    {
      label: '状态',
      name: 'status',
      search: true,
      type: 'select',
      data: {
        1: '待审核',
        2: '审核通过',
        3: '驳回',
      },
      render: 'func:renderStatus',
      col: 6,
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  buttons: [{
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
  page: {
    pageNo: 1,
    pageSize: 10,
  },
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  EXAMINELIST_REQUEST : (state) => ({
    ...state,
    loading: true,
  }),
  EXAMINELIST_SUCCESS: (state, action) => {
    const {
      pageNo, pageSize,
      totalSize, list,
    } = action.data;
    return {
      ...state,
      data: list,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total: totalSize,
      },
    };
  },
  EXAMINELIST_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  EXAMINELIST_SEARCH_CHANGE: (state, action) => ({
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
