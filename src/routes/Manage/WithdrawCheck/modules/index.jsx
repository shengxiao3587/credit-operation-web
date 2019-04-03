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
      name: 'applyNo',
    },
    {
      label: '提交时间',
      name: 'createTimeShow',
      render: 'func:renderCreateTimeShow',
    },
    {
      label: '申请日期',
      name: 'createTime',
      type: 'datetimeRange',
      search: true,
      hidden: true,
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
      name: 'useCurrencyName',
    },
    {
      label: '提款金额',
      name: 'baseAmount',
      render: 'func:renderBaseAmount',
      align: 'right',
    },
    {
      label: '借款利率',
      name: 'borrowRate',
      render: 'func:renderBorrowRate',
      align: 'right',
    },
    {
      label: '到期还款日',
      name: 'repayTime',
      type: 'dateRange',
    },
    {
      label: '状态',
      name: 'statusName',
      render: 'func:renderStatusName',
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
  loadWithdrawCheck: (params) => ({
    types: ['WITHDRAWCHECK_REQUEST', 'WITHDRAWCHECK_SUCCESS', 'WITHDRAWCHECK_FAILURE'],
    callAPI: () => fetch('/withdraw/apply/list', mapToSendData(params)),
  }),
  changeSearch: createAction('WITHDRAWCHECK_SEARCH_CHANGE', 'fields'),
};

const ACTION_HANDLERS = {
  WITHDRAWCHECK_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  WITHDRAWCHECK_SUCCESS: (state, action) => {
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
  WITHDRAWCHECK_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  WITHDRAWCHECK_SEARCH_CHANGE: (state, action) => ({
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
