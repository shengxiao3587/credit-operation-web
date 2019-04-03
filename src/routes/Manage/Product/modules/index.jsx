import fetch from '@f12/fetch';
import {
  mapToSendData,
  mapToAntdFields,
  createAction,
} from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const PRODUCT_REQUEST = 'PRODUCT_REQUEST';
const PRODUCT_SUCCESS = 'PRODUCT_SUCCESS';
const PRODUCT_FAILURE = 'PRODUCT_FAILURE';
const PRODUCT_SEARCHPARAMS_CHANGE = 'PRODUCT_SEARCHPARAMS_CHANGE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  loadFinatialProducts: (params) => ({
    types: [PRODUCT_REQUEST, PRODUCT_SUCCESS, PRODUCT_FAILURE],
    callAPI: () => fetch('/financial/product/list', mapToSendData(params)),
    payload: params,
  }),
  changeSearchParams: createAction(PRODUCT_SEARCHPARAMS_CHANGE, 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  columnData: [],
  columns: [
    {
      label: '产品编号',
      name: 'prodNo',
    },
    {
      label: '产品名称',
      name: 'prodName',
      col: 6,
    },
    {
      label: '所属机构',
      name: 'bankName',
    },
    {
      label: '年利率',
      name: 'borrowRate',
      col: 6,
      align: 'right',
      render: (text) => {
        return `${(text * 100).toFixed(6)}%`;
      },
    },
    {
      label: '计息方式',
      name: 'rateTypeName',
      col: 6,
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
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
    pageNo: 1,
    pageSize: 10,
  },
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [PRODUCT_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [PRODUCT_SUCCESS]: (state, action) => {
    const {
      list,
      pageNo,
      pageSize,
      totalSize,
    } = action.data;
    return {
      ...state,
      columnData: list,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total: totalSize,
      },
      count: pageNo,
    };
  },
  [PRODUCT_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [PRODUCT_SEARCHPARAMS_CHANGE]: (state, action) => ({
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
