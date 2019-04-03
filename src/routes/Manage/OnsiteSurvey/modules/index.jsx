import fetch from '@f12/fetch';
import { message } from 'antd';
import moment from 'moment';
import { createAction, mapToAntdFields, mapToSendData } from '../../../../util';

const initialState = {
  topButtons: [
    {
      label: '返回',
      onClick: 'func:back',
      icon: 'rollback',
      type: 'default',
    },
  ],
  fieldsBefore: [
    {
      label: '',
      name: 'entName',
      type: 'display',
      className: 'display-title',
      labelSpan: 0,
      wrapperSpan: 24,
    }, {
      type: 'title',
      label: '调查信息',
    }, {
      label: '尽调日期',
      name: 'surveyTime',
      type: 'date',
      colSpan: 12,
      labelSpan: 6,
      wrapperSpan: 14,
      required: true,
      className: 'layout-inline',
      disabled: 'func:renderDisabled:run',
    }, {
      label: '参与尽调人员',
      name: 'surveyors',
      type: 'tag',
      placeholder: '尽调人员',
      colSpan: 12,
      labelSpan: 6,
      wrapperSpan: 14,
      value: [],
      required: true,
      className: 'layout-inline',
      disabled: 'func:renderDisabled:run',
    }, {
      type: 'title',
      label: '证明材料',
    }, {
      type: 'html',
      name: 'html',
      colSpan: 24,
      wrapperSpan: 24,
      html: 'func:renderHeader:run',
      className: 'survey-header',
    },
  ],
  fieldsAfter: [
    {
      type: 'title',
      label: '调查报告',
    }, {
      label: '',
      name: 'reports',
      type: 'dynamicAddDel',
      closeType: 'icon',
      addButtonIcon: 'plus',
      addButtonText: '继续添加调查报告',
      colSpan: 23,
      wrapperSpan: 24,
      colon: true,
      afterDelete: 'func:renderAfterDelete',
      disabled: 'func:renderDisabled:run',
      fields: [
        {
          colSpan: '24',
          label: '调查报告标题',
          wrapperSpan: 12,
          name: 'name',
          required: true,
          placeholder: '鞋类箱包/箱包皮具/热销女包/男包',
          max: 200,
          labelSpan: 0,
        },
        {
          colSpan: '24',
          label: '调查报告内容',
          wrapperSpan: 24,
          name: 'comment',
          required: true,
          type: 'textarea',
          placeholder: '内容',
          max: 5000,
          labelSpan: 0,
        },
      ],
    },
  ],
  modalFields: [
    {
      label: 'status',
      type: 'radio',
      name: 'status',
      data: {
        2: '审核通过',
        3: '驳回',
      },
      hideLabel: true,
      required: true,
      value: '2',
    }, {
      label: '驳回原因',
      type: 'textarea',
      name: 'comment',
      required: true,
      max: 300,
      hideLabel: true,
      colSpan: 24,
      hidden: 'func:renderCommentHidden:run',
    },
  ],
  buttons: [{
    label: '保存',
    onClick: 'func:save',
    type: 'default',
  }, {
    label: '审核',
    onClick: 'func:check',
  }],
  loading: false,
  modalLoading: false,
  form: null,
  modalVisible: false,
  deletedReports: [],
  imgIndex: 0,
  imgVisible: false,
  currentImgs: [],
};

initialState.record = mapToAntdFields([...initialState.fieldsBefore, ...initialState.fieldsAfter]);
initialState.record.materials = [];
initialState.modalRecord = mapToAntdFields(initialState.modalFields);

export const actions = {
  fetchSurvey: (params) => ({
    types: ['ONSITESURVEY_REQUEST', 'ONSITESURVEY_SUCCESS', 'ONSITESURVEY_FAILURE'],
    callAPI: () => fetch('/scene/survey/detail', params),
  }),
  deleteSurveyReport: createAction('ONSITESURVEY_DELETE_SURVEY_REPORT', 'index'),
  save: (params) => ({
    types: ['ONSITESURVEY_SAVE_REQUEST', 'ONSITESURVEY_SAVE_SUCCESS', 'ONSITESURVEY_SAVE_FAILURE'],
    callAPI: (state) => fetch('/scene/survey/update', mapToSendData(params, (data) => {
      const newData = data;
      if (typeof newData.surveyTime === 'string') {
        newData.surveyTime = moment(`${newData.surveyTime} 00:00:00`).valueOf();
      }
      newData.reports = [...newData.reports, ...state.OnsiteSurvey.deletedReports];
      delete newData['reportsTemp*'];
      newData.materials.forEach((material) => {
        const newMaterial = material;
        delete newMaterial.sequence;
      });
      return newData;
    })),
  }),
  check: (params) => ({
    types: ['ONSITESURVEY_CHECK_REQUEST', 'ONSITESURVEY_CHECK_SUCCESS', 'ONSITESURVEY_CHECK_FAILURE'],
    callAPI: (state) => fetch('/scene/survey/audit', mapToSendData(params, (data) => {
      const newData = data;
      if (typeof newData.surveyTime === 'string') {
        newData.surveyTime = moment(`${newData.surveyTime} 00:00:00`).valueOf();
      }
      newData.reports = [...newData.reports, ...state.OnsiteSurvey.deletedReports];
      delete newData['reportsTemp*'];
      delete newData.html;
      delete newData.id;
      return newData;
    })),
  }),
  changeRecord: createAction('ONSITESURVEY_RECORD_CHANGE', 'fields'),
  changeModalRecord: createAction('ONSITESURVEY_MODALRECORD_CHANGE', 'fields'),
  persistForm: createAction('ONSITESURVEY_FORM_PERSIST', 'form'),
  cancelModal: createAction('ONSITESURVEY_MODAL_CANCEL'),
  showModal: createAction('ONSITESURVEY_MODAL_SHOW'),
  afterDeleteReport: createAction('ONSITESURVEY_REPORT_DELETE', 'deletedReport'),
  preview: createAction('ONSITESURVEY_IMG_PREVIEW', 'isShow', 'imgs', 'index'),
  reset: createAction('ONSITESURVEY_RESET'),
};

const ACTION_HANDLERS = {
  ONSITESURVEY_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  ONSITESURVEY_SUCCESS: (state, action) => {
    const { data } = action;
    const { materials } = data;
    data.materials = materials.map((material, index) => {
      const newMaterial = material;
      newMaterial.sequence = index + 1;
      return newMaterial;
    });
    data.entName = `${data.entName}现场尽职调查`;
    return {
      ...state,
      record: data,
      loading: false,
    };
  },
  ONSITESURVEY_FAILURE: (state) => ({
    ...state,
    loading: false,
  }),
  ONSITESURVEY_SAVE_REQUEST: (state) => ({
    ...state,
    loading: true,
  }),
  ONSITESURVEY_SAVE_SUCCESS: (state) => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
      deletedReports: [],
      modalVisible: false,
    };
  },
  ONSITESURVEY_SAVE_FAILURE: (state) => {
    return {
      ...state,
      loading: false,
    };
  },
  ONSITESURVEY_DELETE_SURVEY_REPORT: (state) => {
    return {
      ...state,
    };
  },
  ONSITESURVEY_RECORD_CHANGE: (state, action) => {
    return {
      ...state,
      record: action.fields,
    };
  },
  ONSITESURVEY_MODALRECORD_CHANGE: (state, action) => {
    return {
      ...state,
      modalRecord: action.fields,
    };
  },
  ONSITESURVEY_FORM_PERSIST: (state, action) => {
    return {
      ...state,
      form: action.form,
    };
  },
  ONSITESURVEY_CHECK_REQUEST: (state) => ({
    ...state,
    modalLoading: true,
  }),
  ONSITESURVEY_CHECK_SUCCESS: (state) => {
    message.success('操作成功');
    return {
      ...state,
      modalLoading: false,
      deletedReports: [],
      modalVisible: false,
    };
  },
  ONSITESURVEY_CHECK_FAILURE: (state) => {
    return {
      ...state,
      modalLoading: false,
    };
  },
  ONSITESURVEY_MODAL_CANCEL: (state) => ({
    ...state,
    modalVisible: false,
  }),
  ONSITESURVEY_MODAL_SHOW: (state) => ({
    ...state,
    modalVisible: true,
  }),
  ONSITESURVEY_REPORT_DELETE: (state, action) => ({
    ...state,
    deletedReports: [
      ...state.deletedReports,
      action.deletedReport,
    ],
  }),
  ONSITESURVEY_IMG_PREVIEW: (state, action) => ({
    ...state,
    imgIndex: action.index,
    imgVisible: action.isShow,
    currentImgs: action.imgs,
  }),
  ONSITESURVEY_RESET: (state) => ({
    ...state,
    record: {
      ...mapToAntdFields([...state.fieldsBefore, ...state.fieldsAfter]),
      materials: [],
    },
    modalRecord: mapToAntdFields(state.modalFields),
  }),
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
