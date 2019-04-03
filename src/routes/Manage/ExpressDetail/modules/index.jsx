import fetch from '@f12/fetch';
import { mapToAntdFields } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const EXPRESSDETAIL_LOAD_REQUEST = 'EXPRESSDETAIL_LOAD_REQUEST';
const EXPRESSDETAIL_LOAD_SUCCESS = 'EXPRESSDETAIL_LOAD_SUCCESS';
const EXPRESSDETAIL_LOAD_FAILURE = 'EXPRESSDETAIL_LOAD_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [EXPRESSDETAIL_LOAD_REQUEST, EXPRESSDETAIL_LOAD_SUCCESS, EXPRESSDETAIL_LOAD_FAILURE],
    callAPI: () => fetch('/express/detail', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [EXPRESSDETAIL_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [EXPRESSDETAIL_LOAD_SUCCESS]: (state, action) => {
    const list = [];
    action.data.expressNodes.forEach((item) => { list.unshift(item); });
    return {
      ...state,
      record: action.data,
      list,
      loading: false,
    };
  },
  [EXPRESSDETAIL_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fields: [
    {
      label: '订单编号',
      name: 'orderNo',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '收货地址',
      name: 'receiverAddress',
    },
    {
      label: '收件人',
      name: 'receiverName',
    },
    {
      label: '手机号',
      name: 'phone',
    },
  ],
  record: {},
  list: [],
};
initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
