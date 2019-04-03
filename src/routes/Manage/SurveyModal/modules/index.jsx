import fetch from '@f12/fetch';
import {
  mapToSendData,
  mapToAntdFields,
  createAction,
  mapReceivedData,
} from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const SURVEYMODAL_REQUEST = 'SURVEYMODAL_REQUEST';
const SURVEYMODAL_SUCCESS = 'SURVEYMODAL_SUCCESS';
const SURVEYMODAL_FAILURE = 'SURVEYMODAL_FAILURE';

const SURVEYMODAL_EDIT_REQUEST = 'SURVEYMODAL_EDIT_REQUEST';
const SURVEYMODAL_EDIT_SUCCESS = 'SURVEYMODAL_EDIT_SUCCESS';
const SURVEYMODAL_EDIT_FAILURE = 'SURVEYMODAL_EDIT_FAILURE';

const SURVEYMODAL_DELETE_REQUEST = 'SURVEYMODAL_DELETE_REQUEST';
const SURVEYMODAL_DELETE_SUCCESS = 'SURVEYMODAL_DELETE_SUCCESS';
const SURVEYMODAL_DELETE_FAILURE = 'SURVEYMODAL_DELETE_FAILURE';

const SURVEYMODAL_MODAL_OPEN = 'SURVEYMODAL_MODAL_OPEN';
const SURVEYMODAL_MODAL_CLOSE = 'SURVEYMODAL_MODAL_CLOSE';

const SURVEYMODAL_RECORD_CHANGE = 'SURVEYMODAL_RECORD_CHANGE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  loadSurveyModals: (params) => ({
    types: [SURVEYMODAL_REQUEST, SURVEYMODAL_SUCCESS, SURVEYMODAL_FAILURE],
    callAPI: () => fetch('/survey/classify/list', mapToSendData(params)),
  }),
  edit: (params) => ({
    types: [SURVEYMODAL_EDIT_REQUEST, SURVEYMODAL_EDIT_SUCCESS, SURVEYMODAL_EDIT_FAILURE],
    callAPI: () => fetch('/survey/classify/update', mapToSendData(params)),
  }),
  deleteItem: (params) => ({
    types: [SURVEYMODAL_DELETE_REQUEST, SURVEYMODAL_DELETE_SUCCESS, SURVEYMODAL_DELETE_FAILURE],
    callAPI: () => fetch('/survey/classify/delete', mapToSendData(params)),
  }),
  modalOpen: createAction('SURVEYMODAL_MODAL_OPEN', 'record'),
  modalClose: createAction('SURVEYMODAL_MODAL_CLOSE'),
  changeRecord: createAction('SURVEYMODAL_RECORD_CHANGE', 'record'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  columnData: [],
  recordData: {},
  modalVisible: false,
  page: {
    pageSize: 10,
    pageNo: 1,
  },
  columns: [
    {
      title: '序号',
      name: 'sequence',
      columnType: 'sequence',
    },
    {
      title: '标题名称',
      dataIndex: 'name',
    },
    {
      title: '类型名称',
      dataIndex: 'typeName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: 'func:renderAction',
    },
  ],
  topButtons: [{
    label: '刷新',
    icon: 'sync',
    onClick: 'func:refresh',
    loading: 'props:loading',
    type: 'default',
  }],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [SURVEYMODAL_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [SURVEYMODAL_SUCCESS]: (state, action) => {
    const { list } = action.data;
    return {
      ...state,
      columnData: list,
      loading: false,
      page: {
        pageNo: action.data.pageNo,
        pageSize: action.data.pageSize,
        total: action.data.totalSize,
      },
    };
  },
  [SURVEYMODAL_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [SURVEYMODAL_DELETE_REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [SURVEYMODAL_DELETE_SUCCESS]: (state) => ({
    ...state,
    loading: false,
  }),
  [SURVEYMODAL_DELETE_FAILURE]: (state) => {
    return {
      ...state,
      loading: false,
    };
  },
  [SURVEYMODAL_EDIT_REQUEST] : (state) => ({
    ...state,
    confirmLoading: true,
  }),
  [SURVEYMODAL_EDIT_SUCCESS]: (state) => ({
    ...state,
    modalVisible: false,
    recordData: {},
    page: {
      ...state.page,
      pageNo: 1,
    },
  }),
  [SURVEYMODAL_EDIT_FAILURE]: (state) => ({
    ...state,
    modalVisible: false,
  }),
  [SURVEYMODAL_MODAL_OPEN]: (state, action) => ({
    ...state,
    modalVisible: true,
    recordData: mapReceivedData(action.record),
  }),
  [SURVEYMODAL_MODAL_CLOSE]: (state) => ({
    ...state,
    modalVisible: false,
  }),
  [SURVEYMODAL_RECORD_CHANGE]: (state, action) => {
    return {
      ...state,
      recordData: action.record,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
