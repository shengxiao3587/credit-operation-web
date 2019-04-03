import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields, formatMoney } from '../../../../util';

const initialState = {
  withdrawColumns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      label: '业务编号',
      name: 'bizNo',
    },
    {
      label: '生成日期',
      name: 'createTimeShow',
      render: 'func:renderCreateTimeShow',
    },
    {
      label: '生成日期',
      name: 'createTime',
      search: true,
      col: 9,
      labelCol: 4,
      wrapperCol: 20,
      type: 'datetimeRange',
      hidden: true,
    },
    {
      label: '客户名称',
      name: 'entName',
      search: true,
      col: 6,
    },
    {
      label: '提款金额',
      name: 'withdrawAmount',
      render: 'func:renderWithdrawAmount',
      align: 'right',
    },
    {
      label: '到期还款日',
      name: 'repayTime',
      render: 'func:renderRepayTime',
    },
    {
      label: '状态',
      name: 'statusName',
    },
    {
      label: '状态',
      name: 'status',
      search: true,
      col: 6,
      hidden: true,
      type: 'select',
      data: 'func:getStatusData:run',
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
  }],
  widthdrawRecords: [],
  page: {
    pageSize: 10,
    pageNo: 1,
  },
  modalVisible: false,
  modalRecord: {},
  fields:[
    {
      label: '日均销售量',
      name: 'avgSaleNum',
      render: 'func:renderAvgSaleNum',
    },
    {
      label: '日均销售额',
      name: 'avgSaleAmount',
      render: 'func:renderAvgSaleAmount',
    },
    {
      label: '销售进度',
      name: 'saleProgress',
      render: 'func:renderSaleProgress',
    },
    {
      label: '预计销售额',
      name: 'estimateSales',
      render: 'func:renderEstimateSales',
    },
    {
      label: '预计贷款回收率(R)',
      name: 'recoveryRate',
      render: 'func:renderRecoveryRate',
    },
    {
      label: '风险预测',
      name: 'profileRisk',
      render: 'func:renderProfileRisk',
    },
  ],
};
initialState.searchParams = mapToAntdFields(initialState.withdrawColumns.filter((col) => col.search));

export const actions = {
  fetchWithdrawRecords: (params) => ({
    types: ['WITHDRAW_REQUEST', 'WITHDRAW_SUCCESS', 'WITHDRAW_FAILURE'],
    callAPI: () => fetch('/withdraw/list', mapToSendData(params)),
  }),
  changeSearchParams: createAction('WITHDRAW_SEARCH_CHANGE', 'fields'),
  modalOpen: createAction('WITHDRAW_OPEN_MODAL', 'fields'),
  modalClose: createAction('WITHDRAW_CLOSE_MODAL', 'fields'),
};

const ACTION_HANDLERS = {
  WITHDRAW_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  WITHDRAW_SUCCESS: (state, action) => {
    const {
      list,
      pageNo,
      pageSize,
      totalSize,
    } = action.data;
    return {
      ...state,
      widthdrawRecords: list,
      loading: false,
      page: {
        pageNo,
        pageSize,
        total: totalSize,
      },
    };
  },
  WITHDRAW_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  WITHDRAW_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: {
      ...state.searchParams,
      ...action.fields,
    },
  }),
  WITHDRAW_OPEN_MODAL: (state, action) => {
    const modalRecord = {};
    const { fields } = action;
    modalRecord.avgSaleNum = `${fields.avgSaleNum}件`;
    modalRecord.avgSaleAmount = `${formatMoney(fields.avgSaleAmount, 100, 2)}港币`;
    modalRecord.saleProgress = fields.saleProgress;
    modalRecord.estimateSales = `${formatMoney(fields.estimateSales, 100, 2)}港币`;
    modalRecord.recoveryRate = `${fields.recoveryRate}%`;
    modalRecord.profileRisk = fields.profileRisk;
    return {
      ...state,
      modalVisible: true,
      modalRecord,
    };
  },
  WITHDRAW_CLOSE_MODAL: (state) => ({
    ...state,
    modalVisible: false,
    modalRecord: {},
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
