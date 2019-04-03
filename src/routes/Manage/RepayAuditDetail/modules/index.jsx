import fetch from '@f12/fetch';
import { message } from 'antd';
import { createAction, mapReceivedData, mapToAntdFields, mapToSendData } from '../../../../util';

const initialState = {
  record: {
    auditRecord: {
      value: [],
    },
  },
  loading: false,
  fields: [
    {
      label: '提款信息',
      type: 'title',
    },
    {
      label: '客户名称',
      name: 'entName',
    },
    {
      label: '业务编号',
      name: 'withdrawBizNo',
    },
    {
      label: '提款金额',
      name: 'withdrawAmount',
      type: 'number',
      reduce: 100,
      money: true,
    },
    {
      label: '提款日期',
      name: 'withdrawTime',
      type: 'date',
    },
    {
      label: '借款天数',
      name: 'useDays',
    },
    {
      label: '到期还款日',
      name: 'repayTime',
      type: 'date',
    },
    {
      label: '到期应还款（港币）',
      name: 'repayRealAmount',
      colSpan: 24,
      render: 'func:renderRepayReal',
    },
    {
      label: '还款信息',
      type: 'title',
    },
    {
      label: '还款编号',
      name: 'repayBizNo',
    },
    {
      label: '实际还款日',
      name: 'actualRepayTime',
      type: 'date',
      extra: 'func:renderOverdue:run',
    },
    {
      label: '还款金额',
      name: 'repayAmount',
      render: 'func:renderRepay',
    },
    {
      label: '还款类型',
      name: 'paymentTypeName',
    },
    {
      label: '是否已转账还款',
      name: 'realRepayFlag',
      render: 'func:renderRepayFlag',
    },
    {
      label: '当前状态',
      name: 'statusName',
    },
    {
      label: '审批记录',
      type: 'title',
      hidden: 'func:renderCheckHidden:run',
    },
    {
      label: '',
      type: 'table',
      name: 'table',
      colSpan: 24,
      columns: [{
        label: '审批时间',
        name: 'auditTime',
        type: 'datetime',
      }, {
        label: '审批意见',
        name: 'auditComment',
      }, {
        label: '审批人',
        name: 'auditPerson',
      }],
      containerClassName: 'repaydetail-table',
      hidden: 'func:renderCheckHidden:run',
      dataSource: 'func:renderTableData:run',
      rowKey: 'auditTime',
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
      label: '审核',
      onClick: 'func:check',
      hidden: 'func:renderButtonHidden:run',
    },
  ],
  modalFields: [
    {
      label: 'status',
      type: 'radio',
      name: 'status',
      data: {
        2: '审核通过',
        3: '驳回',
      },
      hideLabel: true,
      required: true,
      value: '2',
    }, {
      label: '驳回原因',
      type: 'textarea',
      name: 'rejectReason',
      required: true,
      max: 300,
      hideLabel: true,
      colSpan: 24,
      hidden: 'func:renderCommentHidden:run',
    },
  ],
  modalLoading: false,
  modalVisible: false,
};

initialState.modalRecord = mapToAntdFields(initialState.modalFields);

export const actions = {
  detail: (params) => ({
    types: [
      'REPAYAUDITDETAIL_LOAD_REQUEST',
      'REPAYAUDITDETAIL_LOAD_SUCCESS',
      'REPAYAUDITDETAIL_LOAD_FAILURE',
    ],
    callAPI: () => fetch('/repay/audit/detail', params),
  }),
  changeModalRecord: createAction('REPAYAUDITDETAIL_MODALRECORD_CHANGE', 'fields'),
  cancelModal: createAction('REPAYAUDITDETAIL_MODAL_CANCEL'),
  showModal: createAction('REPAYAUDITDETAIL_MODAL_SHOW'),
  check: (params) => ({
    types: ['REPAYAUDITDETAIL_CHECK_REQUEST', 'REPAYAUDITDETAIL_CHECK_SUCCESS', 'REPAYAUDITDETAIL_CHECK_FAILURE'],
    callAPI: () => fetch('/repay/audit', mapToSendData(params)),
  }),
};

const ACTION_HANDLERS = {
  REPAYAUDITDETAIL_LOAD_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  REPAYAUDITDETAIL_LOAD_SUCCESS: (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      record: mapReceivedData(data),
    };
  },
  REPAYAUDITDETAIL_LOAD_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  REPAYAUDITDETAIL_MODALRECORD_CHANGE: (state, action) => {
    return {
      ...state,
      modalRecord: action.fields,
    };
  },
  REPAYAUDITDETAIL_MODAL_CANCEL: (state) => ({
    ...state,
    modalVisible: false,
  }),
  REPAYAUDITDETAIL_MODAL_SHOW: (state) => ({
    ...state,
    modalVisible: true,
  }),
  REPAYAUDITDETAIL_CHECK_REQUEST: (state) => ({
    ...state,
    modalLoading: true,
  }),
  REPAYAUDITDETAIL_CHECK_SUCCESS: (state) => {
    message.success('操作成功');
    return {
      ...state,
      modalLoading: false,
      modalVisible: false,
    };
  },
  REPAYAUDITDETAIL_CHECK_FAILURE: (state) => ({
    ...state,
    modalLoading: false,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
