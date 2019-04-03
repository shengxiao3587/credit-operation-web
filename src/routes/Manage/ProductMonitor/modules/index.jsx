import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';

const initialState = {
  storeColumns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '商家名称',
      name: 'businessName',
    },
    {
      label: '商家名称',
      name: 'companyName',
      search: true,
      col: 6,
      labelCol: 6,
      wrapperCol: 18,
      hidden: true,
    },
    {
      label: '累计提款金额',
      name: 'totalWithdrawAmount',
      render: 'func:renderAmount',
    },
    {
      label: '累计销售量',
      name: 'totalSaleNum',
    },
    {
      label: '累计销售额',
      name: 'totalSaleAmount',
    },
    {
      label: '库存数量',
      name: 'stockNum',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderOperation',
    },
  ],
  topButtons: [{
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
  storeRecords: [],
  page: {
    pageNo: 1,
    pageSize: 10,
  },
};
initialState.searchParams = mapToAntdFields(initialState.storeColumns.filter((col) => col.search));

export const actions = {
  fetchStoreRecords: (params) => ({
    types: ['STORE_REQUEST', 'STORE_SUCCESS', 'STORE_FAILURE'],
    callAPI: () => fetch('/monitor/business/list', mapToSendData(params)),
  }),
  changeSearchParams: createAction('STORE_SEARCH_CHANGE', 'fields'),
  reset: createAction('STORE_RESET'),
};

const ACTION_HANDLERS = {
  STORE_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  STORE_SUCCESS: (state, action) => {
    const {
      list,
      pageNo,
      pageSize,
      totalSize,
    } = action.data;
    const newList = list.map((item, index) => ({
      ...item,
      rowKey: `${index}`,
    }));
    return {
      ...state,
      storeRecords: newList,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total: totalSize,
      },
    };
  },
  STORE_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  STORE_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  STORE_RESET: () => ({
    ...initialState,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
