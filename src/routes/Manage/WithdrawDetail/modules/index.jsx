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
    },
    {
      label: '业务编号',
      name: 'bizNo',
    },
    {
      label: '贷款用途',
      name: 'auditGoods',
    },
    {
      label: '币种',
      name: 'currencyName',
    },
    {
      label: '提款金额（美元）',
      name: 'usdAmount',
    },
    {
      label: '提款金额（港币）',
      name: 'withdrawAmount',
    },
    {
      label: '借款利率',
      name: 'borrowRate',
    },
    {
      label: '放款日期',
      name: 'lendTime',
    },
    {
      label: '用款天数',
      name: 'useDays',
    },
    {
      label: '到期还款日',
      name: 'repayTime',
    },
    {
      label: '还款方式',
      name: 'repayTypeName',
    },
    {
      label: '当前状态',
      name: 'statusName',
    },
  ],
};

export const actions = {
  detail: (params) => ({
    types: [
      'WITHDRAWDETAIL_LOAD_REQUEST',
      'WITHDRAWDETAIL_LOAD_SUCCESS',
      'WITHDRAWDETAIL_LOAD_FAILURE',
    ],
    callAPI: () => fetch('/withdraw/detail', params),
  }),
};

const ACTION_HANDLERS = {
  WITHDRAWDETAIL_LOAD_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  WITHDRAWDETAIL_LOAD_SUCCESS: (state, action) => {
    const { data } = action;
    if (data.currencyName === '港币') {
      data.usdAmount = '-';
    } else {
      data.usdAmount = formatMoney(data.usdAmount, 100, 2);
    }
    data.withdrawAmount = formatMoney(data.withdrawAmount, 100, 2);
    data.borrowRate = data.borrowRate && `${(data.borrowRate * 100).toFixed(6)}%`;
    data.lendTime = data.lendTime && DateUtil.formatDate(data.lendTime, 'yyyy-MM-dd');
    data.useDays = data.useDays && `${data.useDays}天`;
    data.repayTime = data.repayTime && DateUtil.formatDate(data.repayTime, 'yyyy-MM-dd');
    data.principal = formatMoney(data.principal, 100, 2);
    data.borrowAmount = formatMoney(data.borrowAmount, 100, 2);
    return {
      ...state,
      loading: false,
      data,
    };
  },
  WITHDRAWDETAIL_LOAD_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
