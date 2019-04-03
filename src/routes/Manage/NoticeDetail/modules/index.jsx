import fetch from '@f12/fetch';
import { DateUtil } from '@xinguang/common-tool';
import { message } from 'antd';
import { createAction, mapToAntdFields, getBaseUrl } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const NOTICEDETAIL_LOAD_REQUEST = 'NOTICEDETAIL_LOAD_REQUEST';
const NOTICEDETAIL_LOAD_SUCCESS = 'NOTICEDETAIL_LOAD_SUCCESS';
const NOTICEDETAIL_LOAD_FAILURE = 'NOTICEDETAIL_LOAD_FAILURE';
const NOTICEDETAIL_SAVE_REQUEST = 'NOTICEDETAIL_SAVE_REQUEST';
const NOTICEDETAIL_SAVE_SUCCESS = 'NOTICEDETAIL_SAVE_SUCCESS';
const NOTICEDETAIL_SAVE_FAILURE = 'NOTICEDETAIL_SAVE_FAILURE';
const NOTICEDETAIL_RECORD_CHANGE = 'NOTICEDETAIL_RECORD_CHANGE';
const NOTICEDETAIL_RESET = 'NOTICEDETAIL_RESET';

const initialState = {
  fields: [
    {
      label: '公告编号',
      name: 'noticeId',
      hidden: true,
    },
    {
      label: '公告名称',
      name: 'title',
      hidden: 'func:isShow:run',
      required: true,
    },
    {
      label: '公告类型',
      name: 'noticeType',
      hidden: 'func:isShow:run',
      required: true,
      type: 'select',
      data: 'func:getNoticeTypeData:run',
    },
    {
      label: '公告内容',
      name: 'content',
      type: 'editor',
      wrapperSpan: 16,
      action: `${getBaseUrl()}/notice/img/upload`,
      getUrl: (res) => (res.resultData || {}).fileUrl,
      hidden: 'func:isShow:run',
      required: true,
    },
  ],
  buttons: [
    {
      label: '取消',
      onClick: 'func:back',
      hidden: 'func:isShow:run',
      type: 'default',
    },
    {
      label: '提交',
      onClick: 'func:submit',
      hidden: 'func:isShow:run',
    },
  ],
  topButtons: [
    {
      label: '返回',
      onClick: 'func:back',
      icon: 'rollback',
      type: 'default',
    },
  ],
};
initialState.record = mapToAntdFields(initialState.fields);

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [NOTICEDETAIL_LOAD_REQUEST, NOTICEDETAIL_LOAD_SUCCESS, NOTICEDETAIL_LOAD_FAILURE],
    callAPI: () => fetch('/notice/detail', params),
    payload: params,
  }),
  save: (params) => ({
    types: [NOTICEDETAIL_SAVE_REQUEST, NOTICEDETAIL_SAVE_SUCCESS, NOTICEDETAIL_SAVE_FAILURE],
    callAPI: () => fetch('/notice/update', params),
    payload: params,
  }),
  changeRecord: createAction(NOTICEDETAIL_RECORD_CHANGE, 'fields'),
  reset: createAction(NOTICEDETAIL_RESET),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [NOTICEDETAIL_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [NOTICEDETAIL_LOAD_SUCCESS]: (state, action) => {
    const { data } = action;
    return {
      ...state,
      record: {
        ...data,
        createTime: DateUtil.formatDate(data.createTime, 'yyyy-MM-dd HH:mm'),
      },
      loading: false,
    };
  },
  [NOTICEDETAIL_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICEDETAIL_SAVE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [NOTICEDETAIL_SAVE_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [NOTICEDETAIL_SAVE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [NOTICEDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [NOTICEDETAIL_RESET]:() => ({
    ...initialState,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
