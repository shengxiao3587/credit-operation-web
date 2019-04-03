import fetch from '@f12/fetch';
import { message } from 'antd';
import {
  createAction,
  mapReceivedData,
  mapToAntdFields,
  mapToSendData,
  getBaseUrl,
} from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const USERSETTING_LOAD_REQUEST = 'USERSETTING_LOAD_REQUEST';
const USERSETTING_LOAD_SUCCESS = 'USERSETTING_LOAD_SUCCESS';
const USERSETTING_LOAD_FAILURE = 'USERSETTING_LOAD_FAILURE';
const USERSETTING_SAVE_REQUEST = 'USERSETTING_SAVE_REQUEST';
const USERSETTING_SAVE_SUCCESS = 'USERSETTING_SAVE_SUCCESS';
const USERSETTING_SAVE_FAILURE = 'USERSETTING_SAVE_FAILURE';
const USERSETTING_RECORD_CHANGE = 'USERSETTING_RECORD_CHANGE';
const USERSETTING_FORM_PERSIST = 'USERSETTING_FORM_PERSIST';
const USERSETTING_ADD = 'USERSETTING_ADD';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [USERSETTING_LOAD_REQUEST, USERSETTING_LOAD_SUCCESS, USERSETTING_LOAD_FAILURE],
    callAPI: () => fetch('/user/login/info', params),
    payload: params,
  }),
  save: (params) => ({
    types: [USERSETTING_SAVE_REQUEST, USERSETTING_SAVE_SUCCESS, USERSETTING_SAVE_FAILURE],
    callAPI: () => fetch('/user/setting', mapToSendData(params)),
    payload: params,
  }),
  changeRecord: createAction('USERSETTING_RECORD_CHANGE', 'fields'),
  persistForm: createAction(USERSETTING_FORM_PERSIST, 'form'),
  add: createAction(USERSETTING_ADD),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USERSETTING_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [USERSETTING_LOAD_SUCCESS]: (state, action) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.avatar = action.data.imageUrl;
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      record: mapReceivedData(action.data),
      loading: false,
    };
  },
  [USERSETTING_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [USERSETTING_SAVE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [USERSETTING_SAVE_SUCCESS]: (state, action) => {
    message.success('操作成功');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.avatar = action.imageUrl;
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      loading: false,
    };
  },
  [USERSETTING_SAVE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [USERSETTING_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: {
      ...state.record,
      ...action.fields,
    },
  }),
  [USERSETTING_FORM_PERSIST]: (state, action) => ({
    ...state,
    form: action.form,
  }),
  [USERSETTING_ADD]: (state) => ({
    ...state,
    num: state.num + 1,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  num: 0,
  form: null,
  fields: [
    {
      label: '头像',
      type: 'image',
      name: 'imageUrl',
      tokenSeparators: ',',
      mostPic: 1,
      required: true,
      labelSpan: 0,
      wrapperSpan: 24,
      getUrl: (res) => (res.resultData || {}).fileUrl,
      action: `${getBaseUrl()}/file/upload`,
      headers: {
        Authorization: localStorage.getItem('accessToken'),
      },
      className: 'user-setting-avatar',
      text: '上传头像',
      onPreview: 'func:previewImg',
    },
    {
      label: '登录账号',
      name: 'userName',
      email: true,
      readonly: true,
      labelSpan: 8,
      wrapperSpan: 10,
    },
    {
      label: '旧密码',
      name: 'oldPassword',
      type: 'password',
      required: true,
      labelSpan: 8,
      wrapperSpan: 10,
    },
    {
      label: '新密码',
      name: 'nrePassword',
      type: 'password',
      validator: 'func:passwordValidate',
      required: true,
      labelSpan: 8,
      wrapperSpan: 10,
    },
    {
      label: '确认密码',
      name: 'confirmPassword',
      type: 'password',
      validator: 'func:confirmPasswordValidate',
      required: true,
      labelSpan: 8,
      wrapperSpan: 10,
    },
  ],
  buttons: [
    {
      label: '提交',
      onClick: 'func:submit',
      hidden: 'props:!permission.edit',
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
initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
