import fetch from '@f12/fetch';
import { DateUtil } from '@xinguang/common-tool';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: ['ACCOUNT_REQUEST', 'ACCOUNT_SUCCESS', 'ACCOUNT_FAILURE'],
    callAPI: () => fetch('/wms/account/list', mapToSendData(params)),
  }),
  relateWithdraw: (params) => ({
    types: ['ACCOUNT_RELATE_REQUEST', 'ACCOUNT_RELATE_SUCCESS', 'ACCOUNT_RELATE_FAILURE'],
    callAPI: () => fetch('/wms/account/update', mapToSendData(params)),
  }),
  changeSearch: createAction('ACCOUNT_SEARCH_CHANGE', 'fields'),
  modalClose: createAction('ACCOUNT_MODAL_CLOSE'),
  changeRecord: createAction('ACCOUNT_RECORD_CHANGE', 'fields'),
  topButtonClick: createAction('ACCOUNT_TOP_BUTTON'),
  editButtonClick: createAction('ACCOUNT_EDIT_BUTTON', 'record'),
  viewButtonClick: createAction('ACCOUNT_VIEW_BUTTON', 'record'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  modalVisible: false,
  modalStatus: 'new',
  recordData: {},
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
      label: '所属平台',
      name: 'platform',
    },
    {
      label: '所属平台',
      name: 'platformId',
      search: true,
      hidden: true,
      col: 6,
      labelCol: 6,
      wrapperCol: 18,
      type: 'select',
      data: 'func:getPlatformData:run',
    },
    {
      label: '商家名称',
      name: 'clientName',
    },
    {
      label: 'WMS账号',
      name: 'wmsAccount',
    },
    {
      label: '添加时间',
      name: 'createTime',
    },
    {
      label: '添加时间',
      name: 'inTime',
      type: 'datetimeRange',
      search: true,
      hidden: true,
      col: 10,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '最近操作人',
      name: 'lastOpUser',
    },
    {
      label: '操作',
      name: 'operation',
      render: 'func:renderOperation',
    },
  ],
  topButtons: [{
    label: '添加wms账号',
    onClick: 'func:topButtonClick',
    type: 'default',
  }],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  ACCOUNT_REQUEST : (state) => ({
    ...state,
    loading: true,
  }),
  ACCOUNT_SUCCESS: (state, action) => ({
    ...state,
    data: action.data.list.map((item) => {
      const newItem = item;
      newItem.createTime = DateUtil.formatDate(item.createTime, 'yyyy-MM-dd HH:mm');
      newItem.updateTime = DateUtil.formatDate(item.updateTime, 'yyyy-MM-dd HH:mm');
      return newItem;
    }),
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.totalSize,
    },
  }),
  ACCOUNT_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  ACCOUNT_RELATE_REQUEST: (state) => ({
    ...state,
  }),
  ACCOUNT_RELATE_SUCCESS: (state) => ({
    ...state,
    modalVisible: false,
  }),
  ACCOUNT_RELATE_FAILURE: (state) => ({
    ...state,
  }),
  ACCOUNT_SEARCH_CHANGE: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  ACCOUNT_MODAL_CLOSE: (state) => ({
    ...state,
    modalVisible: false,
  }),
  ACCOUNT_RECORD_CHANGE: (state, action) => {
    const { fields } = action;
    return {
      ...state,
      recordData: fields,
    };
  },
  ACCOUNT_TOP_BUTTON: (state) => ({
    ...state,
    modalVisible: true,
    modalStatus: 'new',
    recordData: {},
  }),
  ACCOUNT_EDIT_BUTTON: (state, action) => ({
    ...state,
    modalVisible: true,
    modalStatus: 'edit',
    recordData: action.record,
  }),
  ACCOUNT_VIEW_BUTTON: (state, action) => ({
    ...state,
    modalVisible: true,
    modalStatus: 'view',
    recordData: action.record,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
