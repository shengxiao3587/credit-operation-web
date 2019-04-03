import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const NOTICE_REQUEST = 'NOTICE_REQUEST';
const NOTICE_SUCCESS = 'NOTICE_SUCCESS';
const NOTICE_FAILURE = 'NOTICE_FAILURE';

const NOTICE_DELETE_REQUEST = 'NOTICE_DELETE_REQUEST';
const NOTICE_DELETE_SUCCESS = 'NOTICE_DELETE_SUCCESS';
const NOTICE_DELETE_FAILURE = 'NOTICE_DELETE_FAILURE';

const NOTICE_CHANGECHECKED_REQUEST = 'NOTICE_CHANGECHECKED_REQUEST';
const NOTICE_CHANGECHECKED_SUCCESS = 'NOTICE_CHANGECHECKED_SUCCESS';
const NOTICE_CHANGECHECKED_FAILURE = 'NOTICE_CHANGECHECKED_FAILURE';

const NOTICE_SEARCH_CHANGE = 'NOTICE_SEARCH_CHANGE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [NOTICE_REQUEST, NOTICE_SUCCESS, NOTICE_FAILURE],
    callAPI: () => fetch('/notice/list', mapToSendData(params)),
  }),
  deleteNotice: (params) => ({
    types: [NOTICE_DELETE_REQUEST, NOTICE_DELETE_SUCCESS, NOTICE_DELETE_FAILURE],
    callAPI: () => fetch('/notice/delete', mapToSendData(params)),
  }),
  checkedChange: (params) => ({
    types: [NOTICE_CHANGECHECKED_REQUEST, NOTICE_CHANGECHECKED_SUCCESS, NOTICE_CHANGECHECKED_FAILURE],
    callAPI: () => fetch('/notice/updown', mapToSendData(params)),
  }),
  changeSearch: createAction(NOTICE_SEARCH_CHANGE, 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  data: [],
  loading: false,
  columns: [
    {
      label: '序号',
      name: 'sequence',
      columnType: 'sequence',
      align:'left',
    },
    {
      label: '公告名称',
      name: 'title',
      search: true,
      align:'left',
      col: 6,
      labelCol: 6,
      wrapperCol: 18,
    },
    {
      label: '类型',
      name: 'noticeTypeName',
      align:'left',
    },
    {
      label: '添加日期',
      name: 'createTime',
      type: 'datetimeRange',
      search: true,
      hidden: true,
      col: 10,
      labelCol: 4,
      wrapperCol: 20,
    },
    {
      label: '添加时间',
      name: 'createTime',
      type: 'datetimeRange',
    },
    {
      label: '操作人',
      name: 'operator',
    },
    {
      label: '当前状态',
      name: 'status',
      render:'func:renderStatus',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  topButtons: [{
    label: '新增',
    onClick: 'func:clickAdd',
    hidden: 'props:!permission.add',
  }, {
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
  page: {
    pageSize: 10,
    pageNo: 1,
  },
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [NOTICE_CHANGECHECKED_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [NOTICE_CHANGECHECKED_SUCCESS]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICE_CHANGECHECKED_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICE_DELETE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [NOTICE_DELETE_SUCCESS]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICE_DELETE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [NOTICE_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.totalSize,
    },
  }),
  [NOTICE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICE_SEARCH_CHANGE]: (state, action) => ({
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
