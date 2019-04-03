import fetch from '@f12/fetch';
import { createAction, mapToAntdFields, mapToSendData } from '../../../../util';

const initialState = {
  columns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '业务编号',
      name: 'bizNo',
    },
    {
      label: '生成时间',
      name: 'createTime',
      type: 'datetimeRange',
      search: true,
      col: 9,
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
      label: '币种',
      name: 'currencyName',
    },
    {
      label: '信用额度',
      name: 'totalCreditLines',
      render: 'func:renderLines',
      align: 'right',
    },
    {
      label: '可用额度',
      name: 'availableLines',
      render: 'func:renderLines',
      align: 'right',
    },
    {
      label: '授信到期日',
      name: 'creditTimeEnd',
      type: 'dateRange',
    },
    {
      label: '状态',
      name: 'fundStatusName',
      render: 'func:renderStatus',
    },
    {
      label: '状态',
      name: 'status',
      hidden: true,
      search: true,
      col: 6,
      data: 'func:getStatusData:run',
      type: 'select',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:columnAction',
    },
  ],
  topButtons: [{
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
  data: [],
  loading: false,
  page: {
    pageSize: 10,
    pageNo: 1,
  },
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

export const actions = {
  loadCreditList: (params) => ({
    types: ['CREDITLIST_REQUEST', 'CREDITLIST_SUCCESS', 'CREDITLIST_FAILURE'],
    callAPI: () => fetch('/credit/list', mapToSendData(params)),
  }),
  freeze: (params) => ({
    types: ['CREDITLIST_FREEZE_REQUEST', 'CREDITLIST_FREEZE_SUCCESS', 'CREDITLIST_FREEZE_FAILURE'],
    callAPI: () => fetch('/credit/freeze', mapToSendData(params)),
  }),
  changeSearch: createAction('CREDITLIST_SEARCH_CHANGE', 'fields'),
};

const ACTION_HANDLERS = {
  CREDITLIST_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  CREDITLIST_SUCCESS: (state, action) => {
    const {
      list,
      pageNo,
      pageSize,
      totalSize,
    } = action.data;
    return {
      ...state,
      data: list,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total:totalSize,
      },
    };
  },
  CREDITLIST_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  CREDITLIST_FREEZE_REQUEST: (state) => ({
    ...state,
  }),
  CREDITLIST_FREEZE_SUCCESS: (state) => ({
    ...state,
  }),
  CREDITLIST_FREEZE_FAILURE: (state) => ({
    ...state,
  }),
  CREDITLIST_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
