import fetch from '@f12/fetch';
import { DateUtil } from '@xinguang/common-tool';
import { createAction, mapToAntdFields, formatMoney, percent2price } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const WITHDRAWCHECKDETAIL_LOAD_REQUEST = 'WITHDRAWCHECKDETAIL_LOAD_REQUEST';
const WITHDRAWCHECKDETAIL_LOAD_SUCCESS = 'WITHDRAWCHECKDETAIL_LOAD_SUCCESS';
const WITHDRAWCHECKDETAIL_LOAD_FAILURE = 'WITHDRAWCHECKDETAIL_LOAD_FAILURE';
const WITHDRAWCHECKDETAIL_AUDIT_REQUEST = 'WITHDRAWCHECKDETAIL_AUDIT_REQUEST';
const WITHDRAWCHECKDETAIL_AUDIT_SUCCESS = 'WITHDRAWCHECKDETAIL_AUDIT_SUCCESS';
const WITHDRAWCHECKDETAIL_AUDIT_FAILURE = 'WITHDRAWCHECKDETAIL_AUDIT_FAILURE';
const WITHDRAWCHECKDETAIL_RECORD_CHANGE = 'WITHDRAWCHECKDETAIL_RECORD_CHANGE';

const WITHDRAWCHECKDETAIL_RESET = 'WITHDRAWCHECKDETAIL_RESET';

const initialState = {
  record : {},
  auditRecord:{
    status:2,
  },
  list : [],
  loading: false,
  fields: [
    {
      label: '企业名称',
      name: 'entName',
    },
    {
      label: '业务编号',
      name: 'applyNo',
    },
    {
      label: '提款申请时间',
      name: 'createTime',
    },
    {
      label: '贷款用途',
      name: 'auditGoods',
    },
    {
      label: '提款金额（美元）',
      name: 'baseAmount',
    },
    {
      label: '提款金额（港币）',
      name: 'withdrawAmount',
    },
    {
      label: '当前状态',
      name: 'statusName',
    },
    {
      label: '用款天数',
      name: 'useDays',
    },
    {
      label: '预计用款日期',
      name: 'useDate',
    },
    {
      label: '预计到期还款日',
      name: 'repayTime',
    },
  ],
  columns:[
    {
      label:'审批人',
      name:'auditor',
    },
    {
      label:'审批结果',
      name:'auditResult',
      render: 'func:renderResult',
    },
    {
      label:'建议',
      name:'comment',
    },
    {
      label:'审批时间',
      name:'auditTime',
    },
  ],
  auditFields:[
    {
      label: '',
      name: 'status',
      type: 'radio',
      data: {
        2: '建议通过',
        3: '驳回',
      },
    },
    {
      label: '',
      name: 'auditAmount',
      placeholder: '输入提款金额（港币）',
      colSpan: 8,
      wrapperSpan: 20,
      hidden: 'func:isHidden:run',
      money: true,
      reduce: 100,
      type: 'number',
      min: 0.01,
      max: 'func:auditAmountMax:run',
      required: true,
      requiredMsg: '请输入提款金额（港币）',
    },
    {
      label: '可用额度',
      colSpan: 8,
      name: 'useCreditLines',
      hidden: 'func:isHidden:run',
      disabled: true,
    },
    {
      label: '',
      name: 'lendTime',
      placeholder: '请选择放款日期',
      type: 'date',
      colSpan: 8,
      wrapperSpan: 20,
      hidden: 'func:isHidden:run',
      required: true,
      requiredMsg: '请选择放款日期',
      disabledDate: 'func:disabledDate',
    },
    {
      label: '',
      name: 'comment',
      type: 'textarea',
      max: 200,
      placeholder: 'func:getPlaceholder:run',
      required: 'func:getRequired:run',
      requiredMsg: 'func:getPlaceholder:run',
    },
  ],
  buttons: [
    {
      label: '取消',
      onClick: 'func:back',
      type: 'default',
    },
    {
      label: '确定',
      onClick: 'func:submit',
    },
  ],
};

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [WITHDRAWCHECKDETAIL_LOAD_REQUEST, WITHDRAWCHECKDETAIL_LOAD_SUCCESS, WITHDRAWCHECKDETAIL_LOAD_FAILURE],
    callAPI: () => fetch('/withdraw/apply/detail', params),
  }),
  audit: (params) => ({
    types: [WITHDRAWCHECKDETAIL_AUDIT_REQUEST, WITHDRAWCHECKDETAIL_AUDIT_SUCCESS, WITHDRAWCHECKDETAIL_AUDIT_FAILURE],
    callAPI: () => fetch('/withdraw/apply/audit', params),
  }),
  changeRecord: createAction(WITHDRAWCHECKDETAIL_RECORD_CHANGE, 'fields'),
  reset: createAction(WITHDRAWCHECKDETAIL_RESET),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [WITHDRAWCHECKDETAIL_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [WITHDRAWCHECKDETAIL_LOAD_SUCCESS]: (state, action) => {
    const { data } = action;
    const list = data.auditList || [];
    list.forEach((item) => {
      const newItem = item;
      newItem.auditTime = item.auditTime && DateUtil.formatDate(item.auditTime);
      if (item.auditResult === '审核通过') {
        const auditAmount = formatMoney(item.auditAmount, 100, 2);
        const lendTime = DateUtil.formatDate(item.lendTime, 'yyyy-MM-dd');
        newItem.comment = `提款金额${auditAmount}港币，放款日期${lendTime};\n${item.comment}`;
      }
    });
    const withdrawAmount = formatMoney(data.withdrawAmount, 100, 2);
    let baseAmount = formatMoney(data.baseAmount, 100, 2);
    if (data.currencyName === '港币') {
      baseAmount = '-';
    }
    return {
      ...state,
      record: {
        entName: data.entName,
        applyNo: data.applyNo,
        createTime: data.createTime && DateUtil.formatDate(data.createTime, 'yyyy-MM-dd HH:mm'),
        auditGoods: data.auditGoods,
        withdrawAmount,
        baseAmount,
        statusName: data.statusName,
        useDays: `${data.useDays}天`,
        useDate: data.useDate && DateUtil.formatDate(data.useDate, 'yyyy-MM-dd'),
        repayTime: data.repayTime && DateUtil.formatDate(data.repayTime, 'yyyy-MM-dd'),
        principal: formatMoney(data.principal, 100, 2),
        borrowAmount: formatMoney(data.borrowAmount, 100, 2),
        withdrawNoticeUrl: data.withdrawNoticeUrl,
        cmclInvoiceUrl: data.cmclInvoiceUrl,
        useCreditLines: percent2price(data.useCreditLines),
      },
      auditRecord: {
        ...state.auditRecord,
        useCreditLines: formatMoney(data.useCreditLines, 100, 2),
      },
      list,
      loading: false,
    };
  },
  [WITHDRAWCHECKDETAIL_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [WITHDRAWCHECKDETAIL_AUDIT_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [WITHDRAWCHECKDETAIL_AUDIT_SUCCESS]: (state) => ({
    ...state,
    loading: false,
  }),
  [WITHDRAWCHECKDETAIL_AUDIT_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [WITHDRAWCHECKDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    auditRecord: action.fields,
  }),
  [WITHDRAWCHECKDETAIL_RESET]: (state) => ({
    ...state,
    auditRecord:{
      status:2,
    },
    record: {},
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------

initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
