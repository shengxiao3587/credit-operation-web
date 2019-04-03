import fetch from '@f12/fetch';

const initialState = {
  data: {},
  loading: false,
  fields: [
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
      name: 'detailAddress',
    },
    {
      label: '创建时间',
      name: 'createTime',
      type: 'datetime',
    },
    {
      label: '最近更新时间',
      name: 'recentUpdateTime',
      type: 'datetime',
    },
    {
      label: '最近操作人',
      name: 'recentOperatePerson',
      colSpan: 24,
    },
    {
      label: '备注',
      name: 'note',
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
};

export const actions = {
  detail: (params) => ({
    types: [
      'ORGANIZATIONVIEW_LOAD_REQUEST',
      'ORGANIZATIONVIEW_LOAD_SUCCESS',
      'ORGANIZATIONVIEW_LOAD_FAILURE',
    ],
    callAPI: () => fetch('/repay/audit/detail', params),
  }),
};

const ACTION_HANDLERS = {
  ORGANIZATIONVIEW_LOAD_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  ORGANIZATIONVIEW_LOAD_SUCCESS: (state, action) => {
    const { data } = action;
    return {
      ...state,
      loading: false,
      data,
    };
  },
  ORGANIZATIONVIEW_LOAD_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
