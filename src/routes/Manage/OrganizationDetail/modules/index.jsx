import fetch from '@f12/fetch';
import { createAction, mapToAntdFields, mapToSendData } from '../../../../util';

const initialState = {
  data: {},
  loading: false,
  fields: [
    {
      label: '',
      name: 'orgId',
      hidden: true,
    },
    {
      label: '机构名称',
      name: 'orgName',
    },
    {
      label: '联系人',
      name: 'contactPerson',
    },
    {
      label: '联系电话',
      name: 'phone',
    },
    {
      label: '地址',
      type: 'address',
      name: 'address',
    },
    {
      label: '详细地址',
      name: 'detailAddress',
    },
    {
      label: '备注',
      name: 'note',
      type: 'textarea',
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
      label: '确定',
      onClick: 'func:save',
    },
  ],
};

initialState.record = mapToAntdFields(initialState.fields);

export const actions = {
  detail: (params) => ({
    types: [
      'ORGANIZATIONDETAIL_LOAD_REQUEST',
      'ORGANIZATIONDETAIL_LOAD_SUCCESS',
      'ORGANIZATIONDETAIL_LOAD_FAILURE',
    ],
    callAPI: () => fetch('/org/detail', params),
  }),
  changeRecord: createAction('ORGANIZATIONDETAIL_RECORD_CHANGE', 'fields'),
  save: (params) => ({
    types: ['ORGANIZATIONDETAIL_SAVE_REQUEST', 'ORGANIZATIONDETAIL_SAVE_SUCCESS', 'ORGANIZATIONDETAIL_SAVE_FAILURE'],
    callAPI: () => fetch('/org/update', mapToSendData(params)),
  }),
  reset: createAction('ORGANIZATIONDETAIL_RESET'),
};

const ACTION_HANDLERS = {
  ORGANIZATIONDETAIL_LOAD_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  ORGANIZATIONDETAIL_LOAD_SUCCESS: (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      data,
    };
  },
  ORGANIZATIONDETAIL_LOAD_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  ORGANIZATIONDETAIL_RECORD_CHANGE: (state, action) => {
    return {
      ...state,
      modalRecord: action.fields,
    };
  },
  ORGANIZATIONDETAIL_RESET: (state, action) => {
    return {
      ...state,
      record: mapToAntdFields(action.fields),
    };
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
