import fetch from '@f12/fetch';
import moment from 'moment';
import { message } from 'antd';
import { createAction, mapReceivedData, mapToAntdFields, mapToSendData } from '../../../../util';

const initialState = {
  record: {},
  loading: false,
  days: 0,
  overdueData: 0,
  totalRepayAmount: 0,
  fields: [
    {
      label: '提款信息',
      type: 'title',
    },
    {
      label: '客户名称',
      name: 'entName',
      disabled: true,
      containerClassName: 'repay-field',
    },
    {
      label: '业务编号',
      name: 'bizNo',
      disabled: true,
      containerClassName: 'repay-field',
    },
    {
      label: '提款金额',
      name: 'withdrawAmount',
      disabled: true,
      containerClassName: 'repay-field',
      type: 'number',
      reduce: 100,
      money: true,
    },
    {
      label: '提款日期',
      name: 'auditTime',
      disabled: true,
      containerClassName: 'repay-field',
      type: 'date',
    },
    {
      label: '借款天数',
      name: 'useDays',
      disabled: true,
      containerClassName: 'repay-field',
    },
    {
      label: '到期还款日',
      name: 'repayTime',
      disabled: true,
      containerClassName: 'repay-field',
      type: 'date',
    },
    {
      label: '到期应还款（港币）',
      name: 'repayRealAmount',
      colSpan: 24,
      disabled: true,
      containerClassName: 'repay-field',
      render: 'func:renderRepayReal',
    },
    {
      label: '还款操作',
      type: 'title',
    },
    {
      label: '还款本金',
      name: 'principal',
      type: 'number',
      colSpan: 24,
      labelSpan: 5,
      wrapperSpan: 6,
      reduce: 100,
      money: true,
      required: true,
      disabled: true,
    },
    {
      label: '实际还款日期',
      name: 'actualRepayTime',
      type: 'date',
      colSpan: 24,
      labelSpan: 5,
      wrapperSpan: 6,
      value: moment().format('YYYY-MM-DD'),
      disabledDate: 'func:renderDisabledDate',
      onChange: 'func:changeDate',
      extra: 'func:renderOverdue:run',
      className: 'actual-date',
      required: true,
    },
    {
      label: '应还款利息',
      name: 'borrowAmount',
      type: 'number',
      colSpan: 24,
      labelSpan: 5,
      wrapperSpan: 6,
      disabled: true,
      reduce: 100,
      money: true,
    },
    {
      label: '逾期',
      name: 'overdueAmount',
      type: 'number',
      colSpan: 24,
      labelSpan: 5,
      wrapperSpan: 6,
      disabled: true,
      render: 'func:renderOverdueAmount',
    },
    {
      label: '应还款总额',
      name: 'totalRepayAmount',
      type: 'number',
      colSpan: 24,
      labelSpan: 5,
      wrapperSpan: 6,
      disabled: true,
      reduce: 100,
      money: true,
    },
    {
      label: '备注',
      name: 'comment',
      type: 'textarea',
      colSpan: 24,
      labelSpan: 5,
      wrapperSpan: 12,
      max: 100,
    },
  ],
  topButtons: [
    {
      label: '刷新',
      onClick: 'func:refresh',
      icon: 'sync',
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
  buttons: [
    {
      label: '还款',
      onClick: 'func:check',
    },
  ],
  modalFields: [
    {
      label: '实际还款日期',
      type: 'textarea',
      name: 'actualRepayTime',
      disabled: true,
      containerClassName: 'inline-field',
    },
    {
      label: '还款总额',
      type: 'number',
      name: 'totalRepayAmount',
      disabled: true,
      containerClassName: 'inline-field',
      reduce: 100,
      money: true,
    },
    {
      label: '还款后可用额度',
      type: 'number',
      name: 'availableLines',
      disabled: true,
      containerClassName: 'inline-field',
      reduce: 100,
      money: true,
    },
    {
      label: '还款方式',
      type: 'display',
      name: 'payType',
      disabled: true,
      containerClassName: 'inline-field',
      value: '线下转账',
    },
    {
      label: '',
      type: 'checkbox',
      name: 'realRepayFlag',
      wrapperSpan: 24,
      required: true,
      data: {
        1: '是否已转账还款',
      },
      requiredMsg: '请确认已转账还款',
    },
  ],
  modalLoading: false,
  modalVisible: false,
};

initialState.modalRecord = mapToAntdFields(initialState.modalFields);
initialState.record = mapToAntdFields(initialState.fields);

export const actions = {
  detail: (params) => ({
    types: [
      'REPAYDETAIL_LOAD_REQUEST',
      'REPAYDETAIL_LOAD_SUCCESS',
      'REPAYDETAIL_LOAD_FAILURE',
    ],
    callAPI: () => fetch('/withdraw/detail', params),
  }),
  changeRecord: createAction('REPAYDETAIL_RECORD_CHANGE', 'fields'),
  changeModalRecord: createAction('REPAYDETAIL_MODALRECORD_CHANGE', 'fields'),
  cancelModal: createAction('REPAYDETAIL_MODAL_CANCEL'),
  showModal: createAction('REPAYDETAIL_MODAL_SHOW'),
  save: (params) => ({
    types: ['REPAYDETAIL_SAVE_REQUEST', 'REPAYDETAIL_SAVE_SUCCESS', 'REPAYDETAIL_SAVE_FAILURE'],
    callAPI: () => fetch('/repay', mapToSendData(params)),
  }),
  changeDate: createAction('REPAYDETAIL_DATE_CHANGE', 'days'),
  getOverdue: (params) => ({
    types: [
      'REPAYDETAIL_LOAD_OVERDUE_REQUEST',
      'REPAYDETAIL_LOAD_OVERDUE_SUCCESS',
      'REPAYDETAIL_LOAD_OVERDUE_FAILURE',
    ],
    callAPI: () => fetch('/repay/overdue', params),
  }),
  getLimit: (params) => ({
    types: [
      'REPAYDETAIL_LOAD_LIMIT_REQUEST',
      'REPAYDETAIL_LOAD_LIMIT_SUCCESS',
      'REPAYDETAIL_LOAD_LIMIT_FAILURE',
    ],
    callAPI: () => fetch('/repay/detail', params),
  }),
  reset: createAction('REPAYDETAIL_RESET'),
};

const ACTION_HANDLERS = {
  REPAYDETAIL_LOAD_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  REPAYDETAIL_LOAD_SUCCESS: (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      record: {
        ...state.record,
        ...mapReceivedData(data),
      },
    };
  },
  REPAYDETAIL_LOAD_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  REPAYDETAIL_RECORD_CHANGE: (state, action) => {
    return {
      ...state,
      record: action.fields,
      modalRecord: {
        ...state.modalRecord,
        actualRepayTime: {
          value: action.fields.actualRepayTime.value,
        },
        totalRepayAmount: {
          value: state.record.principal.value + state.overdueData + state.record.borrowAmount.value,
        },
      },
    };
  },
  REPAYDETAIL_MODALRECORD_CHANGE: (state, action) => {
    return {
      ...state,
      modalRecord: action.fields,
    };
  },
  REPAYDETAIL_MODAL_CANCEL: (state) => ({
    ...state,
    modalVisible: false,
  }),
  REPAYDETAIL_MODAL_SHOW: (state) => ({
    ...state,
    modalVisible: true,
  }),
  REPAYDETAIL_SAVE_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  REPAYDETAIL_SAVE_SUCCESS: (state) => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
      modalVisible: false,
    };
  },
  REPAYDETAIL_SAVE_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  REPAYDETAIL_DATE_CHANGE: (state, action) => ({
    ...state,
    days: action.days,
    overdueData: action.days ? state.overdueData : 0,
  }),
  REPAYDETAIL_LOAD_OVERDUE_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  REPAYDETAIL_LOAD_OVERDUE_SUCCESS: (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      overdueData: data,
      record: {
        ...state.record,
        totalRepayAmount: {
          value: state.record.principal.value + data + state.record.borrowAmount.value,
        },
      },
    };
  },
  REPAYDETAIL_LOAD_OVERDUE_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  REPAYDETAIL_LOAD_LIMIT_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  REPAYDETAIL_LOAD_LIMIT_SUCCESS: (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      modalRecord: {
        ...state.modalRecord,
        availableLines: {
          value: data.availableLines,
        },
      },
    };
  },
  REPAYDETAIL_LOAD_LIMIT_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  REPAYDETAIL_RESET: (state) => ({
    ...state,
    modalRecord: mapToAntdFields(state.modalFields),
    record: mapToAntdFields(state.fields),
    days: 0,
    overdueData: 0,
    totalRepayAmount: 0,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
