import fetch from '@f12/fetch';
import { message } from 'antd';
import { DateUtil } from '@xinguang/common-tool';
import rows from './rows';

const initialState = {
  reportContent: {},
  basicInfoData: {},
  shareholderData: [],
  personData: [],
  limitHighPurchaseRows: [],
};
Object.assign(initialState, rows);

export const actions = {
  fetchReportContent: (params) => ({
    types: ['CREDITREPORT_REQUEST', 'CREDITREPORT_SUCCESS', 'CREDITREPORT_FAILURE'],
    callAPI: () => fetch('/ent/censor/detail', params),
  }),
  submit: (params) => ({
    types: ['CREDITREPORT_SUBMIT_REQUEST', 'CREDITREPORT_SUBMIT_SUCCESS', 'CREDITREPORT_SUBMIT_FAILURE'],
    callAPI: () => fetch('/credit/censor/audit', params),
  }),
};

const formattedReportData = (action) => {
  const d = action.data;
  const { entName, operateTime } = action.data;
  d.entName = `${entName}信用报告`;
  d.creditScore = '暂无';
  d.creditCode = '暂无';
  d.operateTime = DateUtil.formatDate(operateTime);
  return d;
};

const ACTION_HANDLERS = {
  CREDITREPORT_REQUEST: (state) => ({
    ...state,
  }),
  CREDITREPORT_SUCCESS: (state, action) => {
    const reportContent = formattedReportData(action);
    const { basic, shareholder, person } = reportContent.entIndustryInfo;
    const basicInfoData = JSON.parse(basic);
    const shareholderData = JSON.parse(shareholder);
    const personData = JSON.parse(person);
    return {
      ...state,
      reportContent,
      basicInfoData,
      shareholderData,
      personData,
    };
  },
  CREDITREPORT_FAILURE: (state) => ({
    ...state,
  }),
  CREDITREPORT_SUBMIT_REQUEST: (state) => ({
    ...state,
  }),
  CREDITREPORT_SUBMIT_SUCCESS: (state) => ({
    ...state,
  }),
  CREDITREPORT_SUBMIT_FAILURE: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
