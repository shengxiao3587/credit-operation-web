import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';

const initialState = {
  categoryColumns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '入仓时间',
      name: 'inTime',
      type: 'datetimeRange',
      search: true,
      col: 9,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '入库单号',
      name: 'traderInStoreCode',
      search: true,
      col: 6,
    },
    {
      label: '商品条码',
      name: 'goodsNo',
    },
    {
      label: '商品品名',
      name: 'goodsName',
      search: true,
      col: 6,
    },
    {
      label: '入库数量',
      name: 'inNum',
    },
    {
      label: '库存数量',
      name: 'stockNum',
    },
    {
      label: '正品库存数量',
      name: 'realNumber',
    },
    {
      label: '破损库存数量',
      name: 'brokenNumber',
    },
    {
      label: '出库数量',
      name: 'outNum',
    },
    {
      label: '币种',
      name: 'currency',
    },
    {
      label: '入库单价',
      name: 'price',
    },
    {
      label: '采购金额',
      name: 'totalPrice',
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
  },
  {
    label: '返回',
    icon: 'rollback',
    onClick: 'func:back',
    type: 'default',
  }],
  categoryRecords: [],
  page: {
    pageSize: 10,
    pageNo: 1,
  },
};
initialState.searchParams = mapToAntdFields(initialState.categoryColumns.filter((col) => col.search));

export const actions = {
  fetchCategoryRecords: (params) => ({
    types: ['CATEGORY_REQUEST', 'CATEGORY_SUCCESS', 'CATEGORY_FAILURE'],
    callAPI: () => fetch('/monitor/goods/list', mapToSendData(params)),
  }),
  changeSearchParams: createAction('CATEGORY_SEARCH_CHANGE', 'fields'),
  reset: createAction('CATEGORY_RESET'),
};

const ACTION_HANDLERS = {
  CATEGORY_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  CATEGORY_SUCCESS: (state, action) => {
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
      categoryRecords: newList,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total: totalSize,
      },
    };
  },
  CATEGORY_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  CATEGORY_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  CATEGORY_RESET: () => ({
    ...initialState,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
