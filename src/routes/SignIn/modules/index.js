import { message } from 'antd';
import fetch from '@f12/fetch';
import { getUserBaseUrl } from '../../../util';

const CryptoJS = require('../../../../lib/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

const LOGIN__CHECK_REQUEST = 'LOGIN__CHECK_REQUEST';
const LOGIN__CHECK_SUCCESS = 'LOGIN__CHECK_SUCCESS';
const LOGIN__CHECK_FAILURE = 'LOGIN__CHECK_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
const loginRequest = (params) => ({
  type: LOGIN_REQUEST,
  payload: params,
});

const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

const loginFailure = (params) => ({
  type: LOGIN_FAILURE,
  payload: params,
});

const key = CryptoJS.enc.Latin1.parse('eGluZ3Vhbmd0YmI=');
const iv = CryptoJS.enc.Latin1.parse('svtpdprtrsjxabcd');

const login = (params) => (dispatch) => {
  const newParams = {
    ...params,
  };
  dispatch(loginRequest(newParams));
  const encrypted = CryptoJS.AES.encrypt(
    newParams.password,
    key,
    {
      iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
    }
  );
  newParams.password = encrypted.toString();

  return fetch(`${getUserBaseUrl()}/account/login`, {
    ...newParams,
    type: 'username',
  }, { headers:{ Authorization:'Basic Y3Jvc3MtYm9yZGVyOmNyb3NzLWJvcmRlcg==' } })
    .then((json) => {
      if (json.resultCode === '0') {
        dispatch(loginSuccess(json.resultData));
        return true;
      }
      dispatch(loginFailure(json.resultDesc));
      return false;
    });
};

export const actions = {
  login,
  check: (params) => ({
    types: [LOGIN__CHECK_REQUEST, LOGIN__CHECK_SUCCESS, LOGIN__CHECK_FAILURE],
    callAPI: () => fetch('/user/check', params),
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: (state, action) => ({
    ...state,
    username: action.payload.username,
    password: action.payload.password,
    loading: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => {
    const { payload } = action;
    const user = JSON.stringify({
      username: state.username,
    });
    localStorage.setItem('accessToken', payload.access_token);
    localStorage.setItem('refreshToken', payload.refresh_token);
    localStorage.setItem('user', user);
    return {
      ...state,
      user: action.payload,
      loading: false,
    };
  },
  [LOGIN_FAILURE]: (state, action) => {
    message.error(action.payload);
    localStorage.setItem('accessToken', '');
    return {
      ...state,
      user: '',
      loading: false,
    };
  },
  [LOGIN__CHECK_REQUEST]: (state) => ({
    ...state,
  }),
  [LOGIN__CHECK_SUCCESS]: (state) => ({
    ...state,
    checked: true,
  }),
  [LOGIN__CHECK_FAILURE]: (state) => {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    localStorage.setItem('refreshToken', '');
    return {
      ...state,
      checked: false,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  detail: true,
  username: '',
  password: '',
  user: '',
  loading: false,
  checked: false,
};
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
