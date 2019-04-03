import fetch from '@f12/fetch';
import { message } from 'antd';
import moment from 'moment';
import { DateUtil } from '@xinguang/common-tool';
import columns from './columns';
import { formatMoney, createAction } from '../../../../util';

const initialState = {
  loanUsages: [],
  entData: [],
  evidence: [],
  creditCensor: {},
  sceneSurvey: {},
  data: {},
  examine: {},
  examineAdviceContent: [],
  clonedExamine: '',
  imgIndex: 0,
  imgVisible: false,
  currentImgs: [],
};
Object.assign(initialState, columns);

export const formattedRate = (rate) => {
  let r = rate.toString();
  if (r.length > 8) {
    r = Number(r).toFixed(6);
  }
  if (r.length < 4) {
    r = Number(r).toFixed(2);
  }
  return r;
};

const examineAdviceContent = (data) => {
  const {
    operator,
    status,
    statusName,
    currency,
    currencyName,
    operateTime,
  } = data;
  let {
    totalCreditLines,
    borrowDays,
    borrowRate,
    comment,
  } = data;
  const currencyTogether = `币种: ${currency}${currencyName}`;
  totalCreditLines = `信用额度: ${formatMoney(totalCreditLines, 100, 2)}`;
  borrowDays = `借款天数: ${borrowDays}天`;
  borrowRate = `借款利率: ${formattedRate(borrowRate * 100)}%`;
  if (status === 2) {
    comment = `${currencyTogether} ${totalCreditLines} ${borrowDays} ${borrowRate}`;
  }
  return [
    {
      key: '1',
      operator,
      statusName,
      comment,
      operateTime: DateUtil.formatDate(operateTime),
    },
  ];
};

export const actions = {
  loadCreditDetail: (params) => ({
    types: [
      'CREDITASSESSMENT_LOANUSAGES_REQUEST',
      'CREDITASSESSMENT_LOANUSAGES_SUCCESS',
      'CREDITASSESSMENT_LOANUSAGES_FAILURE',
    ],
    callAPI: () => fetch('/credit/apply/detail', params),
  }),
  submit: (params) => ({
    types: [
      'CREDITASSESSMENT_SUBMIT_REQUEST',
      'CREDITASSESSMENT_SUBMIT_SUCCESS',
      'CREDITASSESSMENT_SUBMIT_FAILURE',
    ],
    callAPI: () => fetch('/credit/apply/audit', params),
  }),
  preview: createAction('CREDITASSESSMENT_IMG_PREVIEW', 'isShow', 'imgs', 'index'),
};

const partOfObject = (obj, keysName) => {
  const part = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    if (keysName.includes(k)) {
      part[k] = obj[k];
    }
  }
  return part;
};

const convertTime = (object) => {
  let obj = object;
  if (obj === null) {
    obj = {};
  }
  if ('operateTime' in obj) {
    ['operateTime', 'reportTime'].forEach((time) => {
      const value = obj[time];
      if (value !== undefined) {
        obj[time] = DateUtil.formatDate(value);
      }
    });
  }
  obj.surveyTime = obj.surveyTime && DateUtil.formatDate(obj.surveyTime, 'yyyy-MM-dd');
  return obj;
};

export const currentTime = (time) => {
  let date = new Date();
  if (typeof time === 'object') {
    date = new Date(time);
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day);
};

const ACTION_HANDLERS = {
  CREDITASSESSMENT_LOANUSAGES_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  CREDITASSESSMENT_LOANUSAGES_SUCCESS: (state, action) => {
    const { data } = action;
    const loanUsages = data.applyCategory;
    let { creditCensor, sceneSurvey } = data;
    creditCensor = convertTime(creditCensor);
    sceneSurvey = convertTime(sceneSurvey);
    sceneSurvey.surveyors = sceneSurvey.surveyors && sceneSurvey.surveyors.join(',');
    const entDataNames = [
      'entId',
      'entName',
      'entTypeName',
      'entAddress',
      'annualTurnover',
      'contactName',
      'contactPhone',
    ];
    const entData = [partOfObject(data, entDataNames)];
    const evidenceNames = [
      'bizLicenceUrl',
      'importLicenceUrl',
      'creditRateUrl',
      'tradeRateUrl',
    ];
    const evidence = partOfObject(data, evidenceNames);
    const examineNames = [
      'applyId',
      'borrowDays',
      'borrowRate',
      'compoundRate',
      'penaltyRate',
      'status',
      'currency',
      'currencyName',
      'totalCreditLines',
      'compoundFlag',
      'penaltyFlag',
      'repayType',
      'rateType',
    ];
    const clonedExamine = JSON.stringify(partOfObject(data, examineNames));

    const examine = partOfObject(data, examineNames);
    const dateFormat = 'YYYY-MM-DD';
    const timeRangeEnd = moment(currentTime()).add(1, 'years').subtract(1, 'days');
    examine.initialDateValue = [moment(moment(currentTime()), dateFormat), moment(timeRangeEnd, dateFormat)];
    // const num = examine.totalCreditLines;
    // examine.totalCreditLines = formatMoney(num, 100, 2);
    // ['borrowRate', 'compoundRate', 'penaltyRate'].forEach((name) => {
    //   examine[name] = formattedRate(examine[name] * 100);
    // });
    return {
      ...state,
      loading: false,
      loanUsages,
      entData,
      evidence,
      sceneSurvey,
      creditCensor,
      examine,
      data,
      examineAdviceContent: examineAdviceContent(data),
      clonedExamine,
    };
  },
  CREDITASSESSMENT_LOANUSAGES_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  CREDITASSESSMENT_SUBMIT_REQUEST: (state) => ({
    ...state,
  }),
  CREDITASSESSMENT_SUBMIT_SUCCESS: (state) => ({
    ...state,
  }),
  CREDITASSESSMENT_SUBMIT_FAILURE: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  CREDITASSESSMENT_IMG_PREVIEW: (state, action) => ({
    ...state,
    imgIndex: action.index,
    imgVisible: action.isShow,
    currentImgs: action.imgs,
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
