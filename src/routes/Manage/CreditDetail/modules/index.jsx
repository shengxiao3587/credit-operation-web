import fetch from '@f12/fetch';
import { DateUtil } from '@xinguang/common-tool';
import { formatMoney } from '../../../../util';

const initialState = {
  data: {},
  loading: false,
  fields: [
    {
      label: '客户名称',
      name: 'entName',
      noHidden: true,
    },
    {
      label: '业务编号',
      name: 'bizNo',
      noHidden: true,
    },
    {
      label: '币种',
      name: 'currencyName',
      noHidden: true,
    },
    {
      label: '信用总额度',
      name: 'totalCreditLines',
      noHidden: true,
    },
    {
      label: '可用额度',
      name: 'availableLines',
      noHidden: true,
    },
    {
      label: '借款天数（天）',
      name: 'borrowDays',
      noHidden: true,
    },
    {
      label: '授信开始日',
      name: 'creditTimeStart',
      noHidden: true,
    },
    {
      label: '授信到期日',
      name: 'creditTimeEnd',
      noHidden: true,
    },
    {
      label: '还款方式',
      name: 'repayTypeName',
      noHidden: true,
    },
    {
      label: '借款利率',
      name: 'borrowRate',
      noHidden: true,
    },
    {
      label: '复利利率',
      name: 'compoundRate',
      noHidden: true,
    },
    {
      label: '罚息利率',
      name: 'penaltyRate',
      noHidden: true,
    },
    {
      label: '当前状态',
      name: 'fundStatusName',
      noHidden: true,
    },
  ],
};

export const actions = {
  detail: (params) => ({
    types: [
      'CREDITDETAIL_LOAD_REQUEST',
      'CREDITDETAIL_LOAD_SUCCESS',
      'CREDITDETAIL_LOAD_FAILURE',
    ],
    callAPI: () => fetch('/credit/detail', params),
  }),
};

const ACTION_HANDLERS = {
  CREDITDETAIL_LOAD_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  CREDITDETAIL_LOAD_SUCCESS: (state, action) => {
    const { data } = action;
    data.totalCreditLines = formatMoney(data.totalCreditLines, 100, 2);
    data.availableLines = formatMoney(data.availableLines, 100, 2);
    data.borrowRate = data.borrowRate && `${(data.borrowRate * 100).toFixed(6)}%`;
    data.creditTimeStart = data.creditTimeStart && DateUtil.formatDate(data.creditTimeStart, 'yyyy-MM-dd');
    data.creditTimeEnd = data.creditTimeEnd && DateUtil.formatDate(data.creditTimeEnd, 'yyyy-MM-dd');
    data.penaltyRate = data.penaltyRate && `${(data.penaltyRate * 100).toFixed(6)}%`;
    data.compoundRate = data.compoundRate && `${(data.compoundRate * 100).toFixed(6)}%`;
    return {
      ...state,
      loading: false,
      data,
    };
  },
  CREDITDETAIL_LOAD_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
