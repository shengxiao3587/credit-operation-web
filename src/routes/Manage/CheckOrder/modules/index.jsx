import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';

const initialState = {
  orderColumns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '交易时间',
      name: 'orderTime',
      type: 'datetimeRange',
      search: true,
      col: 9,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '订单号',
      name: 'orderNo',
      search: true,
      col: 6,
    },
    {
      label: '商品品名',
      name: 'goodsName',
    },
    {
      label: '出库单价',
      name: 'salePrice',
    },
    {
      label: '收件人',
      name: 'receiver',
    },
    {
      label: '手机号码',
      name: 'phone',
    },
    {
      label: '收货地址',
      name: 'address',
    },
    {
      label: '当前状态',
      name: 'status',
    },
    {
      label: '快递公司',
      name: 'logisticsCompany',
    },
    {
      label: '物流单号',
      name: 'logisticsNo',
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
  orderRecords: [],
  page: {
    pageNo: 1,
    pageSize: 10,
  },
};
initialState.searchParams = mapToAntdFields(initialState.orderColumns.filter((col) => col.search));

export const actions = {
  fetchOrderRecords: (params) => ({
    types: ['ORDER_REQUEST', 'ORDER_SUCCESS', 'ORDER_FAILURE'],
    callAPI: () => fetch('/monitor/order/list', mapToSendData(params)),
  }),
  changeSearchParams: createAction('ORDER_SEARCH_CHANGE', 'fields'),
  reset: createAction('ORDER_RESET'),
};

const ACTION_HANDLERS = {
  ORDER_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  ORDER_SUCCESS: (state, action) => {
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
      orderRecords: newList,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total: totalSize,
      },
    };
  },
  ORDER_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  ORDER_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  ORDER_RESET: () => ({
    ...initialState,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
