import fetch from '@f12/fetch';
import { message } from 'antd';
import { createAction, formatMoney, mapReceivedData, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const PRODUCTDETAIL_LOAD_REQUEST = 'PRODUCTDETAIL_LOAD_REQUEST';
const PRODUCTDETAIL_LOAD_SUCCESS = 'PRODUCTDETAIL_LOAD_SUCCESS';
const PRODUCTDETAIL_LOAD_FAILURE = 'PRODUCTDETAIL_LOAD_FAILURE';
const PRODUCTDETAIL_SAVE_REQUEST = 'PRODUCTDETAIL_SAVE_REQUEST';
const PRODUCTDETAIL_SAVE_SUCCESS = 'PRODUCTDETAIL_SAVE_SUCCESS';
const PRODUCTDETAIL_SAVE_FAILURE = 'PRODUCTDETAIL_SAVE_FAILURE';
const PRODUCTDETAIL_RECORD_CHANGE = 'PRODUCTDETAIL_RECORD_CHANGE';
const PRODUCTDETAIL_PAGEMODE_SET = 'PRODUCTDETAIL_PAGEMODE_SET';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [PRODUCTDETAIL_LOAD_REQUEST, PRODUCTDETAIL_LOAD_SUCCESS, PRODUCTDETAIL_LOAD_FAILURE],
    callAPI: () => fetch('/financial/product/detail', params),
    payload: params,
  }),
  save: (params) => ({
    types: [PRODUCTDETAIL_SAVE_REQUEST, PRODUCTDETAIL_SAVE_SUCCESS, PRODUCTDETAIL_SAVE_FAILURE],
    callAPI: () => {
      const p = params;
      delete p.config;
      const keys = [
        'compoundRate',
        'penaltyRate',
      ];
      keys.forEach((key, i) => {
        const flagKey = `${key.slice(0, -4)}Flag`;
        if (!p[keys[i]]) {
          p[keys[i]] = 0;
        }
        p[flagKey] = !!p[flagKey];
      });
      return fetch('/financial/product/update', p);
    },
    payload: params,
  }),
  changeRecord: createAction('PRODUCTDETAIL_RECORD_CHANGE', 'fields'),
  setPageMode: createAction('PRODUCTDETAIL_PAGEMODE_SET', 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PRODUCTDETAIL_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [PRODUCTDETAIL_LOAD_SUCCESS]: (state, action) => {
    const { data } = action;
    data.config = '查看配置模型>>';
    const mappedData = mapReceivedData(action.data);
    return {
      ...state,
      record: mappedData,
      compoundRateHidden: !mappedData.compoundFlag.value,
      penaltyRateHidden: !mappedData.penaltyFlag.value,
      loading: false,
    };
  },
  [PRODUCTDETAIL_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [PRODUCTDETAIL_SAVE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [PRODUCTDETAIL_SAVE_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [PRODUCTDETAIL_SAVE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [PRODUCTDETAIL_RECORD_CHANGE]: (state, action) => {
    return {
      ...state,
      record: action.fields,
      compoundRateHidden: !action.fields.compoundFlag.value,
      penaltyRateHidden: !action.fields.penaltyFlag.value,
    };
  },
  [PRODUCTDETAIL_PAGEMODE_SET]: (state, action) => ({
    ...state,
    pageMode: action.fields,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  compoundRateHidden: true,
  penaltyRateHidden: true,
  fields: [
    {
      label: 'id',
      name: 'id',
      hidden: true,
    },
    {
      label: '产品名称',
      name: 'prodName',
      required: true,
      max: 100,
    },
    {
      label: '借款利率',
      name: 'borrowRate',
      type: 'number',
      reduce: 0.01,
      required: true,
      antdAddonAfter: '%',
      precision: 6,
      render: (value) => formatMoney(value, 0.01, 6, true, 2, true),
    },
    {
      label: '还款方式',
      name: 'repayType',
      type: 'select',
      data: 'func:renderRepayType:run',
      required: true,
    },
    {
      label: '计息头尾',
      name: 'rateType',
      type: 'select',
      data: 'func:renderRateType:run',
      required: true,
    },
    {
      label: '逾期复利',
      name: 'compoundRateGroup',
      items: [
        {
          name: 'compoundFlag',
          type: 'switch',
        },
        {
          name: 'compoundRate',
          type: 'number',
          antdAddonAfter: '%',
          wrapperSpan: 24,
          reduce: 0.01,
          precision: 6,
          className: 'product-rate',
          readonly: 'props:compoundRateHidden',
          placeholder: '请输入逾期复利',
          render: (value) => formatMoney(value, 0.01, 6, true, 2, true),
        },
      ],
    },
    {
      label: '逾期罚息',
      name: 'penaltyRateGroup',
      items: [
        {
          name: 'penaltyFlag',
          type: 'switch',
        },
        {
          name: 'penaltyRate',
          type: 'number',
          antdAddonAfter: '%',
          wrapperSpan: 24,
          reduce: 0.01,
          precision: 6,
          className: 'product-rate',
          readonly: 'props:penaltyRateHidden',
          placeholder: '请输入逾期罚息',
          render: (value) => formatMoney(value, 0.01, 6, true, 2, true),
        },
      ],
    },
    {
      label: '产品介绍',
      name: 'prodIntroduce',
      type: 'textarea',
      validator: 'func:checkProdIntroduce',
      max: 300,
    },
    {
      label: '尽调配置',
      name: 'config',
      disabled: true,
      href: 'func:renderHref:run',
      hidden: 'props:!permission.list',
    },
  ],
  buttons: [
    {
      label: '取消',
      onClick: 'func:back',
      type: 'default',
    },
    {
      label: '保存',
      onClick: 'func:submit',
    },
  ],
  topButtons: [
    {
      label: '刷新',
      icon: 'sync',
      onClick: 'func:refresh',
      loading: 'props:loading',
      type: 'default',
    },
    {
      label: '返回',
      onClick: 'func:back',
      icon: 'rollback',
      type: 'default',
    },
  ],
};
initialState.record = mapToAntdFields(initialState.fields);
initialState.record.compoundFlag = {
  value: false,
};
initialState.record.penaltyFlag = {
  value: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
