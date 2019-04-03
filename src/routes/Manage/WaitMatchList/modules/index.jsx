import fetch from '@f12/fetch';
import { DateUtil } from '@xinguang/common-tool';
import { createAction, mapToSendData, mapToAntdFields, formatMoney } from '../../../../util';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: ['WAITMATCHLIST_REQUEST', 'WAITMATCHLIST_SUCCESS', 'WAITMATCHLIST_FAILURE'],
    callAPI: () => fetch('/monitor/unknownGoods/list', mapToSendData(params)),
  }),
  relateWithdraw: (params) => ({
    types: ['WAITMATCHLIST_RELATE_REQUEST', 'WAITMATCHLIST_RELATE_SUCCESS', 'WAITMATCHLIST_RELATE_FAILURE'],
    callAPI: () => fetch('/monitor/relation', mapToSendData(params)),
  }),
  loadWithdraw: (params) => ({
    types: ['WAITMATCHLIST_WITHDRAW_REQUEST', 'WAITMATCHLIST_WITHDRAW_SUCCESS', 'WAITMATCHLIST_WITHDRAW_FAILURE'],
    callAPI: () => fetch('/monitor/withdraw/record', mapToSendData(params)),
  }),
  changeSearch: createAction('WAITMATCHLIST_SEARCH_CHANGE', 'fields'),
  modalOpen: createAction('WAITMATCHLIST_MODAL_OPEN', 'fields'),
  modalClose: createAction('WAITMATCHLIST_MODAL_CLOSE'),
  changeRecord: createAction('WAITMATCHLIST_RECORD_CHANGE', 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  modalVisible: false,
  withdrawlRecords: [],
  recordData: {},
  relateData: {},
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
      label: '商家名称',
      name: 'businessName',
      search: true,
      col: 6,
      labelCol: 6,
      wrapperCol: 18,
    },
    {
      label: '入仓时间',
      name: 'inTime',
      type: 'datetimeRange',
      search: true,
      col: 10,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '商品货号',
      name: 'goodsNo',
      search: true,
      col: 6,
    },
    {
      label: '商品条码',
      name: 'goodsCode',
    },
    {
      label: '商品品名',
      name: 'goodsName',
    },
    {
      label: '入库数量',
      name: 'inNum',
    },
    {
      label: '采购价格',
      name: 'price',
      render: 'func:renderPrice',
    },
    {
      label: '采购金额',
      name: 'totalPrice',
      render: 'func:renderPrice',
    },
    {
      label: '操作',
      name: 'operation',
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
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  WAITMATCHLIST_REQUEST : (state) => ({
    ...state,
    loading: true,
  }),
  WAITMATCHLIST_SUCCESS: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.totalSize,
    },
  }),
  WAITMATCHLIST_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  WAITMATCHLIST_RELATE_REQUEST: (state) => ({
    ...state,
  }),
  WAITMATCHLIST_RELATE_SUCCESS: (state) => ({
    ...state,
    modalVisible: false,
  }),
  WAITMATCHLIST_RELATE_FAILURE: (state) => ({
    ...state,
  }),
  WAITMATCHLIST_WITHDRAW_REQUEST: (state) => ({
    ...state,
  }),
  WAITMATCHLIST_WITHDRAW_SUCCESS: (state, action) => {
    const { data = [] } = action;
    const withdrawlRecords = [];
    data.map((item) => withdrawlRecords.push({
      label: `${DateUtil.formatDate(item.time, 'yyyy-MM-dd')} ${formatMoney(item.price, 100, 2)} ${item.id}`,
      value: item.id,
    }));
    return {
      ...state,
      withdrawlRecords,
    };
  },
  WAITMATCHLIST_WITHDRAW_FAILURE: (state) => ({
    ...state,
  }),
  WAITMATCHLIST_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  WAITMATCHLIST_MODAL_OPEN: (state, action) => ({
    ...state,
    modalVisible: true,
    relateData: {
      ...state.relateData,
      id: action.fields,
    },
  }),
  WAITMATCHLIST_MODAL_CLOSE: (state) => ({
    ...state,
    modalVisible: false,
    relateData : {},
  }),
  WAITMATCHLIST_RECORD_CHANGE: (state, action) => {
    const { fields } = action;
    const withdrawNo = fields.id.value ? fields.id.value : fields.id;
    return {
      ...state,
      recordData: fields,
      relateData: {
        ...state.relateData,
        withdrawNo,
      },
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
